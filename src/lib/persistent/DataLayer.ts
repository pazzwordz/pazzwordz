import type {PasswordEntryView} from "$lib/types";
import type {SupabaseClient} from "@supabase/supabase-js";
import type {Database} from "$lib/database.types";
import {deriveKey, encryptText, sha256HashHex} from "$lib/crypto";
import {error} from "@sveltejs/kit";
import {v4 as uuid4} from "uuid"

export interface DataLayer {
    getPasswordEntries(): Promise<Array<PasswordEntryView>>

    createPasswordEntry(vaultKey: string, password: string, location: string, user: string): Promise<PasswordEntryView>

    isValidVaultKeyHash(hash: string): Promise<boolean>

    getEncryptedText(id: string): Promise<string>

    deleteEntry(id: string): Promise<void>
}

export class DataLayerCloud implements DataLayer {
    constructor(private supabase: SupabaseClient<Database>, private userId: string) {
    }

    public async deleteEntry(id: string) {
        await this.supabase.from("PasswordEntry").delete().eq("id", id)
    }

    public async getEncryptedText(id: string): Promise<string> {
        const result = await this.supabase.from("PasswordEntry").select("encryptedPassword").eq("id", id)
        return result.data![0].encryptedPassword;
    }

    public async createPasswordEntry(vaultKey: string, password: string, location: string, user: string): Promise<PasswordEntryView> {
        const key = deriveKey(vaultKey, 'sussysecretsalt');
        const encryptedPassword = encryptText(password.normalize("NFKD"), key);
        const result = await this.supabase.from("PasswordEntry").insert({
            location: location,
            user: user,
            encryptedPassword: encryptedPassword,
            userId: this.userId
        }).select("id, location, user")
        return result.data![0] as PasswordEntryView;
    }

    public async isValidVaultKeyHash(hash: string) {
        const response = await this.supabase.from("VaultKey").select("vaultKeyHash").eq("id", this.userId)
        const realVaultKey = response.data![0].vaultKeyHash
        return hash == realVaultKey;
    }

    public async getPasswordEntries() {
        const result = await this.supabase.from("PasswordEntry").select("id, location, user")
        return result.data!
    }
}

import {MemoryStorage, TypedStorage} from "$lib/persistent/storageApi";
import type {PasswordEntry} from "$lib/types";

interface AppStorageSchema {
    vaultStorage: LocalVaultStorage
}

interface LocalVaultStorage {
    passwords: Array<PasswordEntry>;
    vaultKeyHash: string | null
}

export class DataLayerLocal implements DataLayer {
    private storage: TypedStorage<AppStorageSchema>;
    private data: LocalVaultStorage;

    constructor() {
        this.storage = new TypedStorage<AppStorageSchema>();
        let storageData = this.storage.getItem("vaultStorage")
        if (!storageData) {
            storageData = {
                passwords: new Array<PasswordEntry>,
                vaultKeyHash: null
            }
        }
        this.data = storageData
        this.pushToStorage()
    }

    private pushToStorage() {
        this.storage.setItem("vaultStorage", this.data);
    }

    public async createPasswordEntry(vaultKey: string, password: string, location: string, user: string): Promise<PasswordEntryView> {
        const key = deriveKey(vaultKey, 'sussysecretsalt');
        const encryptedPassword = encryptText(password.normalize("NFKD"), key);
        const newId = uuid4()
        const newEntry: PasswordEntry = {
            id: newId,
            location: location,
            user: user,
            userId: "UserId",
            encryptedPassword: encryptedPassword
        }
        this.data.passwords.push(newEntry);
        this.pushToStorage();
        return newEntry
    }

    private getEntryIdx(id: string) {
        return this.data.passwords.findIndex((entry) => {
            return entry.id == id;
        });
    }

    private getEntry(id: string) {
        return this.data.passwords.find((entry) => {
            return entry.id == id;
        });
    }

    public async deleteEntry(id: string): Promise<void> {
        const idx = this.getEntryIdx(id);
        this.data.passwords.splice(idx, 1)
        this.pushToStorage()
    }

    public async getEncryptedText(id: string): Promise<string> {
        const entry = this.getEntry(id)!;
        return entry.encryptedPassword
    }

    public async getPasswordEntries(): Promise<Array<PasswordEntryView>> {
        const entryCopy = JSON.parse(JSON.stringify(this.data.passwords))
        return Promise.resolve(entryCopy)
    }

    public async isValidVaultKeyHash(hash: string): Promise<boolean> {
        return Promise.resolve(this.getVaultKeyHash() == hash);
    }

    public isVaultKeyHashSet() {
        return this.getVaultKeyHash() != null
    }

    public setVaultKeyHash(hash: string) {
        this.data.vaultKeyHash = hash;
        this.pushToStorage()
    }

    public getVaultKeyHash() {
        return this.data.vaultKeyHash;
    }
}