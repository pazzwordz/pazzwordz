<script lang="ts">
    import {text} from "@sveltejs/kit";
    import type {DataLayerCloud} from "$lib/persistent/DataLayer";
    import {sha256HashHex} from "$lib/scripts/crypto";
    import {toast} from "@zerodevx/svelte-toast";
    import {errorToastTheme} from "$lib/config";
    import {setVaultKeyCloud, vaultKeyStoreCloud} from "$lib/stores";

    let dataLayer: DataLayerCloud;
    let isModalOpen = false
    let callback: Callback;
    type Callback = (location: string, user: string) => void;

    let location: string | undefined = undefined;
    let user: string | undefined = undefined;

    let vaultKeyInput: string | undefined = undefined;

    export function show(cb: Callback, dl: DataLayerCloud, pwUser: string | undefined, pwLocation: string | undefined) {
        isModalOpen = true;
        dataLayer = dl;
        callback = cb;
        location = pwLocation;
        user = pwUser;
    }

    function closeConfirm() {
        isModalOpen = false;
        callback(location!, user!)
        location = undefined;
        user = undefined;
        vaultKeyInput = undefined;
    }

    async function saveToVault() {
        const hasVault = await dataLayer.isVaultKeyHashSet();
        if (hasVault) {
            if (await unlockVault()) {
                closeConfirm();
            } else {
                vaultKeyInput = undefined;
                toast.push("Wrong Vault Key!", {theme: errorToastTheme});
            }
        } else {
            await createVaultKey();
            closeConfirm();
        }
    }

    function closeCancel() {
        isModalOpen = false;
        location = undefined;
        user = undefined;
        vaultKeyInput = undefined;
    }

    async function createVaultKey() {
        const hash = sha256HashHex(vaultKeyInput!);
        await dataLayer.setVaultKeyHash(hash);
        dataLayer = dataLayer
    }

    async function unlockVault() {
        if (await dataLayer.isValidVaultKeyHash(sha256HashHex(vaultKeyInput!))) {
            const otp = dataLayer.generateOtpKey();
            setVaultKeyCloud(vaultKeyInput!, otp)
            return true
        }
        return false
    }
</script>

<div class="modal" class:modal-open={isModalOpen}>
    <div class="modal-box">
        <h3 class="font-bold text-xl">Save to your Vault</h3>
        <p class="my-4">Save this password to your cloud vault! Just enter your VaultKey as well as the Location and Name of the password.</p>
        <form class="flex flex-col gap-4 pr-4" on:submit={saveToVault}>
            <div class="join">
                <span class="btn join-item pointer-events-none w-28">Vault Key</span>
                <input class="input input-bordered join-item w-full" bind:value={vaultKeyInput} placeholder="Vault Key"/>
            </div>
            <div class="join">
                <span class="btn join-item pointer-events-none w-28">Location</span>
                <input class="input input-bordered join-item w-full" bind:value={location} placeholder="Location"/>
            </div>
            <div class="join">
                <span class="btn join-item pointer-events-none w-28">Name</span>
                <input class="input input-bordered join-item w-full" bind:value={user} placeholder="Name"/>
            </div>
            <div class="modal-action">
                <button type="button" class="btn" on:click={closeCancel}>Cancel</button>
                <button type="submit" class="btn btn-success btn-outline" disabled={!vaultKeyInput || !location || !user}>Save</button>
            </div>
        </form>
    </div>
</div>