<script lang="ts">
    import type {PageData} from "./$types";
    import type {Row} from "$lib/database";
    import {setVaultKey, vaultKeyStore} from "$lib/stores";
    import {decryptHex, deriveKey, encryptText, generateOtpKey, sha256HashHex} from "$lib/crypto";
    import {onMount} from "svelte";
    import {routes} from "$lib/navRoutes";

    type PasswordEntry = Row<"PasswordEntry">
    type PasswordEntryView = Omit<PasswordEntry, "encryptedPassword" | "userId">

    let decryptedEntries = new Map<string, string>();

    let vaults = [{name: "Vault 1"}];
    export let data: PageData;

    const userId = data.session!.user.id;
    let entries = new Array<PasswordEntryView>;
    let vaultKeyInput: string | undefined;
    let pazzView = 0;

    let addPazzName: string | undefined = undefined;
    let addPazzUser: string | undefined = undefined;
    let addPazzPass: string | undefined = undefined;


    onMount(() => {
        refreshEntries();

        fetch("https://cloudflare.com/cdn-cgi/trace")
            .then(response => response.text())
            .then(data => {
                console.log(data);
            }).catch(error => {
            console.log(error);
        });
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

    async function addPassword() {
        addPazzName = undefined;
        addPazzUser = undefined;
        addPazzPass = undefined;
    }

</script>

<div class="w-full flex flex-col lg:flex-row gap-4 lg:p-8 h-[80vh]">
    <div class="lg:w-1/5 flex flex-col items-center gap-4">
        <a class="btn w-64 btn-outline flex gap-2 items-center" href={routes.cloud}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="stroke-current" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"/>
            </svg>
            <span>Back</span>
        </a>
        <div class="flex flex-col gap-4 h-[75%] overflow-y-scroll no-scrollbar">
            <input class="input input-bordered w-64" placeholder="Search"/>
            <div class="join">
                <button class="btn join-item pointer-events-none">View</button>
                <select class="select select-bordered join-item w-full" bind:value={pazzView}>
                    <option selected value={0}>List</option>
                    <option value={1}>Cards</option>
                </select>
            </div>
        </div>
        <form class="flex flex-col gap-4" on:submit={addPassword}>
            <p class="font-medium text-lg">Add Pazzword</p>
            <input class="input input-bordered w-64" placeholder="Name" bind:value={addPazzName}/>
            <input class="input input-bordered w-64" placeholder="User" bind:value={addPazzUser}/>
            <input class="input input-bordered w-64" placeholder="Password" bind:value={addPazzPass}/>
            <button class="btn btn-success btn-outline w-64" disabled="{addPazzName === undefined || addPazzUser === undefined || addPazzPass === undefined}">Add Pazzword</button>
        </form>
    </div>
    <div class="divider divider-vertical lg:divider-horizontal"/>
    <div class="w-full relative">
        {#if $vaultKeyStore == null}
            <div class="absolute top-0 left-0 bg-base-100/90 w-full h-full flex flex-col gap-8 items-center justify-center z-10 text-center">
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
        <div class="lg:h-[95%] overflow-y-scroll">
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
                            <td class="flex gap-2 items-center">
                                <span>{entry.user}</span>
                                <button class="btn btn-xs btn-outline btn-square border-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="stroke-current" viewBox="0 0 115.77 122.88">
                                        <path class="st0" d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z" id="mainIconPathAttribute"></path>
                                    </svg>
                                </button>
                            </td>
                            <td>
                                {#if decryptedEntries.has(entry.id)}
                                    <div class="flex gap-2 items-center">
                                        <span>{decryptedEntries.get(entry.id)}</span>
                                        <button class="btn btn-xs btn-outline btn-square border-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="stroke-current" viewBox="0 0 115.77 122.88">
                                                <path class="st0" d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z" id="mainIconPathAttribute"></path>
                                            </svg>
                                        </button>
                                    </div>
                                {:else }
                                    <div>
                                        <button class="btn btn-xs btn-outline" on:click={() => decrypt(entry)}>Decrypt</button>
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
                                <p>{entry.user}</p>
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