<script lang="ts">
    import type {PageData} from "./$types";
    import type {Row} from "$lib/database";
    import {setVaultKey, vaultKeyStore} from "$lib/stores";
    import {decryptHex, deriveKey, encryptText, generateOtpKey, sha256HashHex} from "$lib/crypto";
    import {onMount} from "svelte";

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
        const {data: passwordEntries} = await data.supabase.from("PasswordEntry").select("id, name, user")
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

    //ToDo: combine vaultkey and otpkey to check if valid otp key, if not, re-register
    async function unlockVault() {
        if (await isValidVaultKeyHash(sha256HashHex(vaultKeyInput!))) {
            setVaultKey(vaultKeyInput!, generateOtpKey())
        } else {
            console.log("wrong vault key")
        }
        vaultKeyInput = undefined;
    }

    let pazzView = 0;


</script>

<div class="w-full flex flex-col lg:flex-row gap-4 p-8 h-[80vh]">
    <div class="lg:w-1/5 flex flex-col items-center gap-4">
        <a class="btn w-64 btn-outline flex gap-2 items-center" href={routes.cloud}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="stroke-current" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"/>
            </svg>
            <span>Back</span>
        </a>
        <div class="flex flex-col gap-4 h-[75%] overflow-y-scroll no-scrollbar">
            <input class="input input-bordered join-item w-64" bind:value={vaultKeyInput} placeholder="Search"/>
            <div class="join">
                <button class="btn join-item pointer-events-none">View</button>
                <select class="select select-bordered join-item w-full" bind:value={pazzView}>
                    <option selected value={0}>List</option>
                    <option value={1}>Cards</option>
                </select>
            </div>
        </div>
        <button class="btn btn-success btn-outline w-64">Add Pazzword</button>
    </div>
    <div class="divider divider-vertical lg:divider-horizontal"/>
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
        <div class="h-[95%] overflow-y-scroll">
            {#if pazzView === 0}
                <table class="table table-zebra mt-4">
                    <thead>
                    <tr>
                        <td>Name</td>
                        <td>User</td>
                        <td>Password</td>
                    </tr>
                    </thead>
                    <tbody>
                    {#each entries as entry}
                        <tr>
                            <td>{entry.name}</td>
                            <td>{entry.user}</td>
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
            {:else if pazzView === 1}
                <div class="grid grid-cols-3 gap-4 mt-4">
                    {#each entries as entry}
                        <div class="card w-full bg-base-100 shadow-xl">
                            <div class="card-body">
                                <h2 class="card-title">{entry.name}</h2>
                                <p>{entry.description}</p>
                                <div class="card-actions justify-end">
                                    <button class="btn btn-primary" on:click={() => decrypt(entry)}>Decrypt</button>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>