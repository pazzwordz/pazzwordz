import type {PasswordEntryView} from "$lib/types";
import type {SupabaseClient} from "@supabase/supabase-js";
import type {Database} from "$lib/database.types";
import {deriveKey, encryptText, sha256HashHex} from "$lib/crypto";
import {error} from "@sveltejs/kit";
import {v4 as uuidv4, v4 as uuid4} from "uuid"

export interface DataLayer {
    getPasswordEntries(): Promise<Array<PasswordEntryView>>

    createPasswordEntry(vaultKey: string, password: string, location: string, user: string): Promise<PasswordEntryView>

    isValidVaultKeyHash(hash: string): Promise<boolean>

    getEncryptedText(id: string): Promise<string>

    deleteEntry(id: string): Promise<void>

    isValidVaultKeyHash(hash: string): Promise<boolean>

    isVaultKeyHashSet(): Promise<boolean>

    setVaultKeyHash(hash: string): Promise<void>

    getVaultKeyHash(): Promise<string>

    deriveSaltedKey(key: string): Buffer

    generateOtpKey(): Buffer
}

export class DataLayerCloud implements DataLayer {
    constructor(private supabase: SupabaseClient<Database>, private userId: string) {
    }

    public deriveSaltedKey(key: string): Buffer {
        return deriveKey(key, this.userId);
    }

    public generateOtpKey(): Buffer {
        let uuid = uuidv4();
        return this.deriveSaltedKey(uuid)
    }

    public async isVaultKeyHashSet(): Promise<boolean> {
        const response = await this.supabase.from("VaultKey")
            .select("*", {count: "exact"}).eq("id", this.userId);
        return response.count != 0;
    }

    public async setVaultKeyHash(hash: string): Promise<void> {
        await this.supabase.from("VaultKey")
            .upsert({
                id: this.userId,
                vaultKeyHash: hash
            });
    }

    public async getVaultKeyHash(): Promise<string> {
        const response = await this.supabase.from("decrypted_VaultKey").select("decrypted_vaultKeyHash")
            .eq("id", this.userId)
        return response.data![0].decrypted_vaultKeyHash!
    }

    public async deleteEntry(id: string) {
        await this.supabase.from("PasswordEntry").delete().eq("id", id)
    }

    public async getEncryptedText(id: string): Promise<string> {
        const result = await this.supabase.from("PasswordEntry").select("encryptedPassword").eq("id", id)
        return result.data![0].encryptedPassword;
    }

    public async createPasswordEntry(vaultKey: string, password: string, location: string, user: string): Promise<PasswordEntryView> {
        const key = this.deriveSaltedKey(vaultKey)
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
        const realVaultKey = await this.getVaultKeyHash();
        return hash == realVaultKey;
    }

    public async getPasswordEntries() {
        const result = await this.supabase.from("PasswordEntry").select("id, location, user")
        return result.data!
    }
}

import {MemoryStorage, TypedStorage} from "$lib/persistent/storageApi";
import type {PasswordEntry} from "$lib/types";
import * as buffer from "buffer";

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

    public deriveSaltedKey(key: string): Buffer {
        return deriveKey(key, 'sussysecretsalt');
    }

    public generateOtpKey(): Buffer {
        let uuid = uuidv4();
        return this.deriveSaltedKey(uuid)
    }

    private pushToStorage() {
        this.storage.setItem("vaultStorage", this.data);
    }

    public async createPasswordEntry(vaultKey: string, password: string, location: string, user: string): Promise<PasswordEntryView> {
        const key = this.deriveSaltedKey(vaultKey)
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
        return Promise.resolve(await this.getVaultKeyHash() == hash);
    }

    public async isVaultKeyHashSet() {
        return Promise.resolve(await this.getVaultKeyHash() != null)
    }

    public async setVaultKeyHash(hash: string) {
        this.data.vaultKeyHash = hash;
        this.pushToStorage()
    }

    public getVaultKeyHash() {
        return Promise.resolve(this.data.vaultKeyHash!);
    }
}