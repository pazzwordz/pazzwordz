import {derived, writable} from "svelte/store";
import {persisted} from "$lib/persisted";
import {decryptHex, encryptText} from "$lib/crypto";

interface Serializer<T> {
    parse(text: string): T

    stringify(object: T): string
}

const passsthroughSerializer: Serializer<any> = {
    stringify: (value) => value,
    parse: (value) => value,
}

const bufferSerializer: Serializer<Uint8Array | null> = {
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

export function setVaultKey(plainKey: string, otpKey: Uint8Array) {
    otpKeyStore.set(otpKey);
    const encrypted = encryptText(plainKey, otpKey)
    console.log("encrypted " + encrypted)
    console.log("decrypted " + decryptHex(encrypted, otpKey))
    console.log("Saved " + otpKey)
    vaultKeyStoreInternal.set(encrypted)
    //vaultKeyStoreInternal.set(plainKey)
}


const vaultKeyStoreInternal = persisted<string | null>("vaultKey", null, {
    storage: "session",
})

//@ts-ignore
const otpKeyStore = persisted<Uint8Array | null>("otpKey", null, {
    serializer: bufferSerializer,
    storage: "session"
})


export const vaultKeyStore = derived([vaultKeyStoreInternal, otpKeyStore],
    ([$vaultKeyStoreInternal, $otpKeyStore]) => {
        if ($otpKeyStore == null || $vaultKeyStoreInternal == null)
            return null
        return decryptHex($vaultKeyStoreInternal!, $otpKeyStore!)
        //return $vaultKeyStoreInternal;
    });


