import type {PasswordEntryView} from "$lib/types";
import type {SupabaseClient} from "@supabase/supabase-js";
import type {Database} from "$lib/database.types";
import {deriveKey, encryptText} from "$lib/crypto";
import {error} from "@sveltejs/kit";
import {v4 as uuid4} from "uuid"
export interface DataLayer {
    getPasswordEntries(): Promise<Array<PasswordEntryView>>

    createPasswordEntry(vaultKey: string, password: string, name: string, user: string): Promise<PasswordEntryView>

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

    public async createPasswordEntry(vaultKey: string, password: string, name: string, user: string): Promise<PasswordEntryView> {
        const key = deriveKey(vaultKey, 'sussysecretsalt');
        const encryptedPassword = encryptText(password.normalize("NFKD"), key);
        const result = await this.supabase.from("PasswordEntry").insert({
            name: name,
            user: user,
            encryptedPassword: encryptedPassword,
            userId: this.userId
        }).select("id, name, user")
        return result.data![0] as PasswordEntryView;
    }

    public async isValidVaultKeyHash(hash: string) {
        const response = await this.supabase.from("VaultKey").select("vaultKeyHash").eq("id", this.userId)
        const realVaultKey = response.data![0].vaultKeyHash
        return hash == realVaultKey;
    }

    public async getPasswordEntries() {
        const result = await this.supabase.from("PasswordEntry").select("id, name, user")
        return result.data!
    }
}

import {MemoryStorage, TypedStorage} from "$lib/localStorage";
import type {PasswordEntry} from "$lib/types";

interface AppStorageSchema {
    passwords: Map<string, PasswordEntry>;
    vaultKeyHash: string
}


export class DataLayerLocal implements DataLayer {
    private storage: TypedStorage<AppStorageSchema>;

    constructor() {
        //ToDo: memory storage should be singleton since in-memory storage should be shared between typed storage instances
        const memoryStorage = new MemoryStorage();
        this.storage = new TypedStorage<AppStorageSchema>();
        if(!this.storage.getItem("passwords")) {
            this.storage.setItem("passwords", new Map<string, PasswordEntry>())
        }
    }

    public async createPasswordEntry(vaultKey: string, password: string, name: string, user: string): Promise<PasswordEntryView> {
        const key = deriveKey(vaultKey, 'sussysecretsalt');
        const encryptedPassword = encryptText(password.normalize("NFKD"), key);
        const newId = uuid4()
        const newEntry: PasswordEntry = {
            id: newId,
            name: name,
            user: user,
            userId: "UserId",
            encryptedPassword: encryptedPassword
        }
        const entries = this.storage.getItem("passwords")!;
        entries.set(newId, newEntry)
        this.storage.setItem("passwords", entries)
        return newEntry
    }

    public async deleteEntry(id: string): Promise<void> {
        const entries = this.storage.getItem("passwords")!;
        entries.delete(id)
        this.storage.setItem("passwords", entries)
    }

    public async getEncryptedText(id: string): Promise<string> {
        return Promise.resolve("string")
    }

    public async getPasswordEntries(): Promise<Array<PasswordEntryView>> {
        const entries = this.storage.getItem("passwords")!;
        const array = Array.from(entries.values())
        return Promise.resolve(array)
    }

    public async isValidVaultKeyHash(hash: string): Promise<boolean> {
        return this.storage.getItem("vaultKeyHash") == hash;
    }
}