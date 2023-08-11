<script lang="ts">
    import type {SupabaseClient} from "@supabase/supabase-js";
    import type {Database} from "$lib/database.types";
    import type {Row} from "$lib/database";
    import {onMount} from "svelte";
    import {vaultKeyStore} from "$lib/stores";
    import {goto} from "$app/navigation";
    import * as aesjs from "aes-js"
    import {pbkdf2Sync} from "pbkdf2"
    import {deriveKey, encryptText, decryptHex} from "$lib/crypto.js";

    type PasswordEntry = Row<"PasswordEntry">
    type PasswordEntryView = Omit<PasswordEntry, "encryptedPassword" | "userId">
    let newName: string;
    let newPassword: string;

    export let data: PageData;
    const supabase = data.supabase as SupabaseClient<Database>;

    let entries = new Array<PasswordEntryView>();

    let decryptedEntries = new Map<string, string>();

    onMount(() => {
        if (!$vaultKeyStore)
            goto("/vault")
        refreshEntries();
    })

    async function fetchCryptedText(id: string) {
        const result = await supabase.from("PasswordEntry").select("encryptedPassword").eq("id", id)
        return result.data![0].encryptedPassword;
    }

    async function refreshEntries() {
        entries = new Array<PasswordEntry>();
        //ToDo: remove eq, row level security can handle this
        const response = await supabase.from("PasswordEntry").select("id, name, description").eq("userId", data.session.user.id)
        const resData = response.data!;
        entries = resData;
    }


    async function createNewEntry() {
        const key = deriveKey($vaultKeyStore, 'sussysecretsalt');
        const encryptedPassword = encryptText(newPassword.normalize("NFKD"), key);
        const result = await supabase.from("PasswordEntry").insert({
            name: newName,
            description: "Hello",
            encryptedPassword: encryptedPassword,
            userId: data.session.user.id
        }).select("id, name, description")
        entries.push(result.data![0])
        entries = entries
        newName = "";
        newPassword = "";
    }

    async function decrypt(entry: PasswordEntryView) {
        const encryptedText = await fetchCryptedText(entry.id);
        const key = deriveKey($vaultKeyStore, 'sussysecretsalt');
        const password = decryptHex(encryptedText, key);
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
        <table class="table table-zebra">
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
                            <div>
                                <button on:click={() => decrypt(entry)}>Decrypt</button>
                            </div>
                        {/if}
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
</div>