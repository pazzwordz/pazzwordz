<script lang="ts">
    import type {SupabaseClient} from "@supabase/supabase-js";
    import type {Database} from "$lib/database.types";
    import type {Row} from "$lib/database";
    import {onMount} from "svelte";
    import {vaultKeyStore} from "$lib/stores";
    import {goto} from "$app/navigation";
    import * as aesjs from "aes-js"

    type PasswordEntry = Row<"PasswordEntry">
    let newName: string;
    let newPassword: string;

    export let data: PageData;
    const supabase = data.supabase as SupabaseClient<Database>;

    let entries = new Array<PasswordEntry>();
    let decryptedEntries = new Map<string, string>();

    onMount(() => {
        if (!$vaultKeyStore)
            goto("/vault")
        refreshEntries();
    })

    async function refreshEntries() {
        entries = new Array<PasswordEntry>();
        //ToDo: remove eq, row level security can handle this
        const response = await supabase.from("PasswordEntry").select("*").eq("userId", data.session.user.id)
        const resData = response.data!;
        entries = resData;
    }

    const key_256 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
        29, 30, 31];

    function encryptText(text: string, key: number[]) {
        let textBytes = aesjs.utils.utf8.toBytes(text);
        let aesCtr = new aesjs.ModeOfOperation.ctr(key);
        let encryptedBytes = aesCtr.encrypt(textBytes);
        let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        return encryptedHex;
    }

    function decryptHex(encryptedHex: string, key: number[]) {
        let encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
        let aesCtr = new aesjs.ModeOfOperation.ctr(key);
        let decryptedBytes = aesCtr.decrypt(encryptedBytes);
        let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        return decryptedText;
    }

    async function createNewEntry() {
        // const encryptedPassword = AES.encrypt(newPassword, $vaultKeyStore).toString();
        const encryptedPassword = encryptText(newPassword, key_256);
        await supabase.from("PasswordEntry").insert({
            name: newName,
            description: "Hello",
            encryptedPassword: encryptedPassword,
            userId: data.session.user.id
        })
        newName = "";
        newPassword = "";
        await refreshEntries()
    }

    function decrypt(entry: PasswordEntry) {
        const password = decryptHex(entry.encryptedPassword, key_256);
        console.log(password)
        decryptedEntries.set(entry.id, password)
        decryptedEntries = decryptedEntries
        entries = entries
    }
</script>
<div>
    <div>
        <input type="text" bind:value={newName} placeholder="Name">
        <input type="password" bind:value={newPassword} placeholder="Password">
        <button on:click={createNewEntry}>Create</button>
    </div>
    <div class="w-screen mt-6">
        <table class="w-full">
            <thead>
            <tr>
                <td>Name</td>
                <td>Description</td>
                <td>Password</td>
            </tr>
            </thead>
            <tbody>
            {#each entries as entry}
                <tr>
                    <td>{entry.name}</td>
                    <td>{entry.description}</td>
                    <td>
                        {#if decryptedEntries.has(entry.id)}
                            {decryptedEntries.get(entry.id)}
                        {:else }
                            {entry.encryptedPassword}
                            <button on:click={() => decrypt(entry)}>Decrypt</button>
                        {/if}
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
</div>