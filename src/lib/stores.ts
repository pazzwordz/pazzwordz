import {writable} from "svelte/store";
import {persisted} from "$lib/persisted";

interface Serializer<T> {
    parse(text: string): T
    stringify(object: T): string
}

const stringPassthroughSerializer: Serializer<string> = {
    stringify: (value) => value,
    parse: (value) => value,
}

// @ts-ignore
export const vaultKeyStore = persisted<string>("vaultKey", undefined, {
    serializer: stringPassthroughSerializer,
    storage: "session"
})

// @ts-ignore
export const otpKeyStore = persisted<string>("vaultKey", undefined, {
    serializer: stringPassthroughSerializer,
    storage: "session"
})