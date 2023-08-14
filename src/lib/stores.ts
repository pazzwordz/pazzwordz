import {derived, writable} from "svelte/store";
import {persisted} from "$lib/scripts/persisted";
import {decryptHex, encryptText} from "$lib/scripts/crypto";
import type {DataLayerLocal} from "$lib/persistent/DataLayer";

interface Serializer<T> {
    parse(text: string): T
    stringify(object: T): string
}

const uint8Serializer: Serializer<Uint8Array | null> = {
    stringify(bytes: Uint8Array | null): string {
        if (bytes == null)
            return JSON.stringify(null);
        const serializedArray = Array.from(bytes);
        return JSON.stringify(serializedArray);
    },
    parse(text: string): Uint8Array | null {
        const obj = JSON.parse(text);
        if (obj == null)
            return null;
        return new Uint8Array(obj);
    }
}

export const fingerprintStore = writable<string>(undefined);

export function setVaultKeyCloud(plainKey: string, otpKey: Uint8Array) {
    otpKeyStoreCloud.set(otpKey);
    const encrypted = encryptText(plainKey, otpKey)
    vaultKeyStoreCloudInternal.set(encrypted)
}

export function setVaultKeyLocal(plainKey: string, otpKey: Uint8Array) {
    otpKeyStoreLocal.set(otpKey);
    const encrypted = encryptText(plainKey, otpKey)
    vaultKeyStoreLocalInternal.set(encrypted)
}


const vaultKeyStoreCloudInternal = persisted<string | null>("vaultKeyCloud", null, {
    storage: "session",
})

const vaultKeyStoreLocalInternal = persisted<string | null>("vaultKeyLocal", null, {
    storage: "session",
})

//@ts-ignore
const otpKeyStoreCloud = persisted<Uint8Array | null>("otpKeyCloud", null, {
    serializer: uint8Serializer,
    storage: "session"
})

const otpKeyStoreLocal = persisted<Uint8Array | null>("otpKeyLocal", null, {
    serializer: uint8Serializer,
    storage: "session"
})

export const vaultKeyStoreCloud = derived([vaultKeyStoreCloudInternal, otpKeyStoreCloud],
    ([$vaultKeyStoreInternal, $otpKeyStore]) => {
        if ($otpKeyStore == null || $vaultKeyStoreInternal == null)
            return null
        return decryptHex($vaultKeyStoreInternal!, $otpKeyStore!)
    });

export const vaultKeyStoreLocal = derived([vaultKeyStoreLocalInternal, otpKeyStoreLocal],
    ([$vaultKeyStoreInternal, $otpKeyStore]) => {
        if ($otpKeyStore == null || $vaultKeyStoreInternal == null)
            return null
        return decryptHex($vaultKeyStoreInternal!, $otpKeyStore!)
    });


