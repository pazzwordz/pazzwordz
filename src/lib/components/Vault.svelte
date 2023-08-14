<script lang="ts">
    import type {PasswordEntry, PasswordEntryView} from "$lib/types";
    import {setVaultKeyCloud, setVaultKeyLocal, vaultKeyStoreCloud, vaultKeyStoreLocal} from "$lib/stores";
    import {decryptHex, deriveKey, encryptText, sha256HashHex} from "$lib/crypto";
    import {onMount} from "svelte";
    import {routes} from "$lib/navRoutes";
    import type {DataLayer} from "$lib/persistent/DataLayer";
    import {copyToClipboard, isValidHttpUrl} from "$lib/functions";
    import {faCopy, faEye, faEyeSlash, faKey, faShare, faTrash} from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa"
    import {DataLayerCloud, DataLayerLocal} from "$lib/persistent/DataLayer";
    import type {Database} from "$lib/database.types";
    import type {SupabaseClient} from "@supabase/supabase-js";
    import ConfirmModal from "$lib/components/ConfirmModal.svelte";
    import GenPwModal from "$lib/components/GenPwModal.svelte";
    import Tooltip from "$lib/components/Tooltip.svelte";
    import FuzzySearch from 'fuzzy-search'
    import ImportPwsModal from "$lib/components/ImportPwsModal.svelte";
    import type {ImportedPassword} from "$lib/passwordImporter";
    import ImportReportModal from "$lib/components/ImportReportModal.svelte";
    import {exportToCsv} from "$lib/passwordImporter";
    import SharePwModal from "$lib/components/SharePwModal.svelte";
    import {successToastTheme} from "$lib/config";
    import {toast} from "@zerodevx/svelte-toast";


    let decryptedEntries = new Map<string, string>();

    export let supabase: SupabaseClient<Database> | undefined = undefined;
    export let userId: string | undefined = undefined

    let confirmModal: ConfirmModal;
    let genPwModal: GenPwModal;
    let importPwsModal: ImportPwsModal;
    let importReportModal: ImportReportModal;
    let sharePwModal: SharePwModal;

    let dataLayer: DataLayer;

    let usedVaultKeyStore;
    let setKeyFunction: Function;

    $: {
        if (supabase) {
            usedVaultKeyStore = vaultKeyStoreCloud;
            setKeyFunction = setVaultKeyCloud
        } else {
            usedVaultKeyStore = vaultKeyStoreLocal;
            setKeyFunction = setVaultKeyLocal
        }
    }

    let filterString: string = "";
    let entries = new Array<PasswordEntryView>;
    $: filteredEntries = filter(entries, filterString);

    function filter(entries: Array<PasswordEntryView>, filter: string) {
        const entrySearcher = new FuzzySearch(entries, ["location", "user"], {
            caseSensitive: false,
        });
        return entrySearcher.search(filter);
    }

    let vaultKeyInput: string | undefined;

    let addPazzLocation: string | undefined = undefined;
    let addPazzUser: string | undefined = undefined;
    let addPazzPass: string | undefined = undefined;


    onMount(async () => {
        if (supabase) {
            dataLayer = new DataLayerCloud(supabase, userId!)
        } else {
            dataLayer = new DataLayerLocal();
        }

        refreshEntries();
    })

    async function refreshEntries() {
        entries = await dataLayer.getPasswordEntries();
    }

    async function decryptPasswordOnly(entry: PasswordEntryView) {
        const encryptedText = await dataLayer.getEncryptedText(entry.id);
        const key = dataLayer.deriveSaltedKey($usedVaultKeyStore!);
        return decryptHex(encryptedText, key);
    }

    function deleteEntry(entry: PasswordEntryView) {
        confirmModal.show(async () => {
            await dataLayer.deleteEntry(entry.id);
            await refreshEntries();
        }, undefined, {
            header: "Delete Password",
            description: `Are you sure you want to delete password "${entry.location}"`
        })
    }

    async function showDecrypt(entry: PasswordEntryView) {
        const password = await decryptPasswordOnly(entry);
        decryptedEntries.set(entry.id, password)
        decryptedEntries = decryptedEntries
        entries = entries
    }

    async function exportPasswords() {
        const exportEntries = new Array<ImportedPassword>();
        for (const entry of entries) {
            exportEntries.push({
                location: entry.location,
                user: entry.user,
                password: await decryptPasswordOnly(entry)
            })
        }
        let content = exportToCsv(exportEntries);
        content = encryptText(content, deriveKey("supersecretkey", "supersecretsalt"))
        const contentBuffer = (new TextEncoder()).encode(content);
        const blob = new Blob([contentBuffer], {type: 'application/octet-stream'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'pazzwordz.pazz';
        link.click();
    }

    async function hideDecrypt(entry: PasswordEntryView) {
        decryptedEntries.delete(entry.id)
        decryptedEntries = decryptedEntries
    }

    function isCloudVault() {
        return dataLayer instanceof DataLayerCloud;
    }

    async function createVaultKey() {
        const hash = sha256HashHex(vaultKeyInput!);
        await dataLayer.setVaultKeyHash(hash);
        vaultKeyInput = undefined;
        dataLayer = dataLayer
    }

    async function unlockVault() {
        if (await dataLayer.isValidVaultKeyHash(sha256HashHex(vaultKeyInput!))) {
            const otp = dataLayer.generateOtpKey();
            setKeyFunction(vaultKeyInput!, otp)
        } else {
            console.log("wrong vault key")
        }
        vaultKeyInput = undefined;
    }

    async function addPassword() {
        const entry = await dataLayer.createPasswordEntry($usedVaultKeyStore!, addPazzPass!, addPazzLocation!, addPazzUser!)
        entries.push(entry)
        entries = entries;
        addPazzLocation = undefined;
        addPazzUser = undefined;
        addPazzPass = undefined;
    }


    async function pwToClipboard(entry: PasswordEntryView) {
        let password = decryptedEntries.get(entry.id)
        if (!password)
            password = await decryptPasswordOnly(entry)
        copyToClipboard(password);
    }


    function generateNewPassword() {
        genPwModal.show((pw) => {
            addPazzPass = pw;
        })
    }

    async function onPasswordsImport(importedEntries: Array<ImportedPassword>) {
        let duplicates = new Array<PasswordEntryView>();
        const toAdd = new Array<ImportedPassword>();
        for (const importedEntry of importedEntries) {
            const foundEntry = entries.find((entry: PasswordEntryView) =>
                entry.location == importedEntry.location
                && entry.user == entry.user);
            if (foundEntry) {
                console.log("found")
                duplicates.push(foundEntry)
            } else {
                console.log("add")
                toAdd.push(importedEntry);
            }
        }
        if (toAdd.length > 0) {
            const added = await dataLayer.createPasswordEntries($usedVaultKeyStore!, toAdd)
            entries = entries.concat(added);
            toast.push("Imported Passwords", {theme: successToastTheme})
        }

        if (duplicates.length > 0)
            importReportModal.show(duplicates)

    }

    async function onSharePassword(entry: PasswordEntryView) {
        const passwordToShare = await decryptPasswordOnly(entry);
        sharePwModal.show(passwordToShare)
    }

</script>

<ConfirmModal bind:this={confirmModal}/>
<GenPwModal bind:this={genPwModal}/>
<ImportPwsModal bind:this={importPwsModal}/>
<ImportReportModal bind:this={importReportModal}/>
<SharePwModal bind:this={sharePwModal} supabase={supabase} userId={userId}/>

<div class="w-full flex flex-col lg:flex-row gap-4 lg:p-8 h-[80vh]">
    <div class="lg:w-1/5 flex flex-col items-center gap-4">
        <a class="btn w-64 btn-outline flex gap-2 items-center" href={routes.cloud.cloud}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="stroke-current"
                 viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                      d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"/>
            </svg>
            <span>Back</span>
        </a>
        <div class="flex flex-col gap-4 h-[75%] overflow-y-scroll no-scrollbar">
            <input class="input input-bordered w-64" placeholder="Search" bind:value={filterString}/>
            <button class="btn" on:click={() => exportPasswords()}>Export</button>
            <button class="btn" on:click={() => importPwsModal.show(onPasswordsImport)}>Import</button>
        </div>
        <form class="flex flex-col gap-4" on:submit={addPassword}>
            <p class="font-medium text-lg">Add Pazzword</p>
            <input class="input input-bordered w-64" placeholder="Location" bind:value={addPazzLocation}/>
            <input class="input input-bordered w-64" placeholder="User" bind:value={addPazzUser}/>
            <div class="relative">
                <input class="input input-bordered w-64" placeholder="Password" bind:value={addPazzPass}/>
                <Tooltip text="Generate Password" class="absolute right-2 top-[50%] translate-y-[-50%]">
                    <button type="button" class="btn btn-outline btn-xs border-none" on:click={generateNewPassword}>
                        <Fa icon={faKey} class="stroke-current"/>
                    </button>
                </Tooltip>
            </div>
            <button class="btn btn-success btn-outline w-64" type="submit"
                    disabled="{addPazzLocation === undefined || addPazzUser === undefined ||
                    addPazzPass === undefined}">Add
                Pazzword
            </button>
        </form>
    </div>
    <div class="divider divider-vertical lg:divider-horizontal"/>
    <div class="w-full relative">
        {#if dataLayer != undefined}
            {#await dataLayer.isVaultKeyHashSet() then isSet}
                {#if !isSet}
                    <div class="absolute top-0 left-0 bg-base-100/90 w-full h-full flex flex-col gap-8 items-center justify-center z-10 text-center">
                        <b class="text-4xl">Crete new vault key</b>
                        <form class="join" on:submit={createVaultKey}>
                            <div>
                                <div>
                                    <input class="input input-bordered join-item" bind:value={vaultKeyInput}
                                           placeholder="Vault Key"/>
                                </div>
                            </div>
                            <button class="btn join-item">Unlock</button>
                        </form>
                    </div>
                {:else if $usedVaultKeyStore == null}
                    <div class="absolute top-0 left-0 bg-base-100/90 w-full h-full flex flex-col gap-8 items-center justify-center z-10 text-center">
                        <b class="text-4xl">Enter Master Password</b>
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
            {/await}
        {/if}
        <h2 class="text-4xl font-bold">Your Pazzwordz</h2>
        <div class="lg:h-[95%] overflow-y-scroll">
            <table class="table table-zebra table-fixed mt-4">
                <thead>
                <tr>
                    <td>Location</td>
                    <td>User</td>
                    <td>Password</td>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                {#each filteredEntries as entry}
                    <tr>
                        <td class="h-[4rem]">
                            {#if isValidHttpUrl(entry.location)}
                                <a class="break-words link link-hover line-clamp-2" href="{entry.location}"
                                   target="_blank">{entry.location}</a>
                            {:else}
                                <div class="break-words line-clamp-2">{entry.location}</div>
                            {/if}
                        </td>
                        <td class="h-[4rem] flex gap-2 items-center">
                            <span>{entry.user}</span>
                            <Tooltip text="Copy" class="relative">
                                <button class="btn btn-xs btn-outline btn-square border-none"
                                        on:click={() => copyToClipboard(entry.user)}>
                                    <Fa icon={faCopy} class="stroke-current" size="lg"/>
                                </button>
                            </Tooltip>
                        </td>
                        <td class="h-[4rem]">
                            {#if decryptedEntries.has(entry.id)}
                                <div class="flex gap-2 items-center">
                                    <span class="break-words">{decryptedEntries.get(entry.id)}</span>
                                </div>
                            {:else }
                                <div class="flex gap-2 items-center">
                                    <div>••••••••••••••••</div>
                                </div>
                            {/if}
                        </td>
                        <td class="h-[4rem]">
                            {#if decryptedEntries.has(entry.id)}
                                <Tooltip text="Decrypt">
                                    <button class="btn btn-xs btn-outline btn-square border-none"
                                            on:click={() => hideDecrypt(entry)}>
                                        <Fa icon={faEyeSlash} class="stroke-current" size="lg"/>
                                    </button>
                                </Tooltip>
                            {:else}
                                <Tooltip text="Hide">
                                    <button class="btn btn-xs btn-outline btn-square border-none"
                                            on:click={() => showDecrypt(entry)}>
                                        <Fa icon={faEye} class="stroke-current" size="lg"/>
                                    </button>
                                </Tooltip>
                            {/if}
                            <Tooltip text="Copy">
                                <button class="btn btn-xs btn-outline btn-square border-none"
                                        on:click={() => pwToClipboard(entry)}>
                                    <Fa icon={faCopy} class="stroke-current" size="lg"/>
                                </button>
                            </Tooltip>
                            {#if isCloudVault()}
                                <Tooltip text="Share">
                                    <button class="btn btn-xs btn-outline btn-square border-none"
                                            on:click={() => onSharePassword(entry)}>
                                        <Fa icon={faShare} class="stroke-current" size="lg"/>
                                    </button>
                                </Tooltip>
                            {/if}
                            <Tooltip text="Delete">
                                <button class="btn btn-xs btn-outline btn-square border-none"
                                        on:click={() => deleteEntry(entry)}>
                                    <Fa icon={faTrash} class="stroke-current text-error" size="lg"/>
                                </button>
                            </Tooltip>
                        </td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>