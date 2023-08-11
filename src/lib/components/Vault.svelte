<script lang="ts">
    import type {PasswordEntryView} from "$lib/types";
    import {setVaultKey, vaultKeyStore} from "$lib/stores";
    import {decryptHex, deriveKey, generateOtpKey, sha256HashHex} from "$lib/crypto";
    import {onMount} from "svelte";
    import {routes} from "$lib/navRoutes";
    import type {DataLayer} from "$lib/DataLayer";
    import {copyToClipboard} from "$lib/functions";
    import {faCopy, faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa"
    let decryptedEntries = new Map<string, string>();

    export let dataLayer: DataLayer;

    let entries = new Array<PasswordEntryView>;
    let vaultKeyInput: string | undefined;
    let pazzView = 0;

    let addPazzName: string | undefined = undefined;
    let addPazzUser: string | undefined = undefined;
    let addPazzPass: string | undefined = undefined;


    onMount(async () => {
        refreshEntries();
    })

    async function refreshEntries() {
        entries = await dataLayer.getPasswordEntries();
    }

    async function decryptPasswordOnly(entry: PasswordEntryView) {
        const encryptedText = await dataLayer.getEncryptedText(entry.id);
        const key = deriveKey($vaultKeyStore!, 'sussysecretsalt');
        return decryptHex(encryptedText, key);
    }

    async function showDecrypt(entry: PasswordEntryView) {
        const password = await decryptPasswordOnly(entry);
        decryptedEntries.set(entry.id, password)
        decryptedEntries = decryptedEntries
        entries = entries
    }

    async function hideDecrypt(entry: PasswordEntryView) {
        decryptedEntries.delete(entry.id)
        decryptedEntries = decryptedEntries
    }


    async function unlockVault() {
        if (await dataLayer.isValidVaultKeyHash(sha256HashHex(vaultKeyInput!))) {
            setVaultKey(vaultKeyInput!, generateOtpKey())
        } else {
            console.log("wrong vault key")
        }
        vaultKeyInput = undefined;
    }

    async function addPassword() {
        const entry = await dataLayer.createPasswordEntry($vaultKeyStore!, addPazzPass!, addPazzName!, addPazzUser!)
        entries.push(entry)
        entries = entries;
        addPazzName = undefined;
        addPazzUser = undefined;
        addPazzPass = undefined;
    }


    async function pwToClipboard(entry: PasswordEntryView) {
        let password = decryptedEntries.get(entry.id)
        if(!password)
            password = await decryptPasswordOnly(entry)
        copyToClipboard(password);
    }

</script>

<div class="w-full flex flex-col lg:flex-row gap-4 lg:p-8 h-[80vh]">
    <div class="lg:w-1/5 flex flex-col items-center gap-4">
        <a class="btn w-64 btn-outline flex gap-2 items-center" href={routes.cloud}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="stroke-current"
                 viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                      d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"/>
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
            <button class="btn btn-success btn-outline w-64"
                    disabled="{addPazzName === undefined || addPazzUser === undefined || addPazzPass === undefined}">Add
                Pazzword
            </button>
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
                            <input class="input input-bordered join-item" bind:value={vaultKeyInput}
                                   placeholder="Vault Key"/>
                        </div>
                    </div>
                    <button class="btn join-item">Unlock</button>
                </form>
            </div>
        {/if}
        <h2 class="text-4xl font-bold">Your Pazzwordz</h2>
        <div class="lg:h-[95%] overflow-y-scroll">
            {#if pazzView === 0}
                <table class="table table-zebra table-fixed mt-4">
                    <thead>
                    <tr>
                        <td>Name</td>
                        <td>User</td>
                        <td>Password</td>
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    {#each entries as entry}
                        <tr>
                            <td>{entry.name}</td>
                            <td class="flex gap-2 items-center">
                                <span>{entry.user}</span>
                                <button class="btn btn-xs btn-outline btn-square border-none"
                                        on:click={() => copyToClipboard(entry.user)}>
                                    <Fa icon={faCopy} class="stroke-current" size="lg"/>
                                </button>
                            </td>
                            <td>
                                {#if decryptedEntries.has(entry.id)}
                                    <div class="flex gap-2 items-center">
                                        <span>{decryptedEntries.get(entry.id)}</span>
                                    </div>
                                {:else }
                                    <div class="flex gap-2">
                                        <div>********</div>
                                    </div>
                                {/if}
                            </td>
                            <td>
                                {#if decryptedEntries.has(entry.id)}
                                    <button class="btn btn-xs btn-outline btn-square border-none"
                                            on:click={() => hideDecrypt(entry)}>
                                        <Fa icon={faEyeSlash} class="stroke-current" size="lg"/>
                                    </button>
                                {:else}
                                    <button class="btn btn-xs btn-outline btn-square border-none"
                                            on:click={() => showDecrypt(entry)}>
                                        <Fa icon={faEye} class="stroke-current" size="lg"/>
                                    </button>
                                {/if}
                                <button class="btn btn-xs btn-outline btn-square border-none"
                                        on:click={() => pwToClipboard(entry)}>
                                    <Fa icon={faCopy} class="stroke-current" size="lg"/>
                                </button>
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
                                    <button class="btn btn-primary" on:click={() => showDecrypt(entry)}>Decrypt</button>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>