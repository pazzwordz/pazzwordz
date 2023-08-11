import {writable} from "svelte/store";
import {persisted} from "$lib/persisted";

interface Serializer<T> {
    parse(text: string): T
    stringify(object: T): string
}

const passsthroughSerializer: Serializer<any> = {
    stringify: (value) => value,
    parse: (value) => value,
}

// @ts-ignore
export const vaultKeyStore = persisted<string>("vaultKey", undefined, {
    serializer: passsthroughSerializer,
    storage: "session"
})


// @ts-ignore
export const otpKeyStore = persisted<Buffer>("otpKey", undefined, {
    serializer: passsthroughSerializer,
    storage: "session"
})
