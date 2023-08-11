<script lang="ts">
    import type {PageData} from "./$types";
    import {routes} from "$lib/navRoutes";
    import type {Row} from "$lib/database";
    import {otpKeyStore} from "$lib/stores";
    import {decryptHex, deriveKey, encryptText, generateOtpKey, sha256HashHex} from "$lib/crypto";
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";
    import {persisted} from "$lib/persisted";

    const vaultKeyStore = persisted<string | null>("vaultKey", null, {
        storage: "session",
    })


    type PasswordEntry = Row<"PasswordEntry">
    type PasswordEntryView = Omit<PasswordEntry, "encryptedPassword" | "userId">
    let decryptedEntries = new Map<string, string>();

    let vaults = [{name: "Vault 1"}];
    export let data: PageData;
    const userId = data.session!.user.id;

    let entries = new Array<PasswordEntryView>;

    onMount(() => {
        refreshEntries();
    })


    async function refreshEntries() {
        entries = new Array<PasswordEntryView>();
        const {data: passwordEntries} = await data.supabase.from("PasswordEntry").select("id, name, description")
        entries = passwordEntries!;
    }

    async function fetchEncryptedText(id: string) {
        const result = await data.supabase.from("PasswordEntry").select("encryptedPassword").eq("id", id)
        return result.data![0].encryptedPassword;
    }

    async function decrypt(entry: PasswordEntryView) {
        const encryptedText = await fetchEncryptedText(entry.id);
        const key = deriveKey($vaultKeyStore!, 'sussysecretsalt');
        const password = decryptHex(encryptedText, key);
        decryptedEntries.set(entry.id, password)
        decryptedEntries = decryptedEntries
        entries = entries
    }

    let vaultKeyInput: string | undefined;


    async function isValidVaultKeyHash(hash: string) {
        const response = await data.supabase.from("VaultKey").select("vaultKeyHash").eq("id", userId)
        const realVaultKey = response.data![0].vaultKeyHash
        return hash == realVaultKey;
    }

    async function unlockVault() {
        if (await isValidVaultKeyHash(sha256HashHex(vaultKeyInput!))) {
            const otpKey = generateOtpKey();
            vaultKeyStore.set(vaultKeyInput!);
            otpKeyStore.set(otpKey)
            vaultKeyStore.set(vaultKeyInput!);
        } else {
            console.log("wrong vault key")
        }
        vaultKeyInput = undefined;
    }


</script>

<div class="w-full flex gap-4 p-8 h-[80vh]">
    <div class="w-1/5 flex flex-col items-center gap-4">
        <button class="btn w-28 btn-outline flex gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="stroke-current" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"/>
            </svg>
            <span>Back</span>
        </button>
        <!--        <h2 class="text-4xl font-bold text-start w-full">Vaults</h2>-->
        <div class="flex flex-col gap-4 h-[75%] overflow-y-scroll no-scrollbar">
            {#each vaults as vault}
                <button class="btn btn-outline w-64">{vault.name}</button>
            {/each}
        </div>
        <button class="btn bg-base-100 w-64">+ Create Vault</button>
        <button class="btn btn-success btn-outline w-64">Add Pazzword</button>
    </div>
    <div class="divider divider-horizontal"/>
    <div class="w-full relative">
        {#if $vaultKeyStore == null}
            <div class="absolute top-0 left-0 bg-base-100/80 w-full h-full flex flex-col gap-8 items-center justify-center z-10">
                <b class="text-4xl">Master Password Not Set</b>
                <form class="join" on:submit={unlockVault}>
                    <div>
                        <div>
                            <input class="input input-bordered join-item" bind:value={vaultKeyInput} placeholder="Vault Key"/>
                        </div>
                    </div>
                    <button class="btn join-item">Unlock</button>
                </form>
            </div>
        {/if}
        <h2 class="text-4xl font-bold">Your Pazzwordz</h2>
        <div class=" h-[95%] overflow-y-scroll">
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
</div>