import {pbkdf2Sync} from "pbkdf2";
import {createHash} from "sha256-uint8array";
import * as aesjs from "aes-js";
import {v4 as uuidv4} from 'uuid';
import type {ByteSource} from "aes-js";

export function sha256HashHex(text: string) {
    return createHash().update(text).digest("hex")
}

export function deriveKey(text: string, salt: string) {
    return pbkdf2Sync(text.normalize("NFKD"), salt.normalize("NFKD"), 100, 256 / 8, 'sha512');
}

export function encryptText(text: string, key: ByteSource) {
    let textBytes = aesjs.utils.utf8.toBytes(text);
    let aesCtr = new aesjs.ModeOfOperation.ctr(key);
    let encryptedBytes = aesCtr.encrypt(textBytes);
    let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex;
}

export function decryptHex(encryptedHex: string, key: ByteSource) {
    let encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
    let aesCtr = new aesjs.ModeOfOperation.ctr(key);
    let decryptedBytes = aesCtr.decrypt(encryptedBytes);
    let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    return decryptedText;
}
