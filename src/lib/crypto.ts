import {pbkdf2Sync} from "pbkdf2";
import {vaultKeyStore} from "$lib/stores";

export function deriveKey(text: string, salt: string) {
    return pbkdf2Sync(text.normalize("NFKD"), salt.normalize("NFKD"), 100, 256 / 8, 'sha512');
}