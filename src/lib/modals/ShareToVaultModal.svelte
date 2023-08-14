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

    function closeCancel() {
        isModalOpen = false;
        location = undefined;
        user = undefined;
        vaultKeyInput = undefined;
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
            setVaultKeyCloud(vaultKeyInput!, otp)
        } else {
            toast.push("Wrong Vault Key!", {theme: errorToastTheme});
        }
        vaultKeyInput = undefined;
    }
</script>

<div class="modal" class:modal-open={isModalOpen}>
    <div class="modal-box">
        <h3 class="font-bold text-lg">Add to Vault</h3>
        {#if dataLayer}
            {#await dataLayer.isVaultKeyHashSet() then isSet}
                {#if !isSet}
                    <div class="">
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
                {:else if $vaultKeyStoreCloud == null}
                    <div class="">
                        <b class="text-4xl">Unlock Vault</b>
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
                {:else}
                    <input class="input input-bordered" type="text" bind:value={location} placeholder="location"/>
                    <input class="input input-bordered" type="text" bind:value={user} placeholder="name"/>
                    <div class="modal-action">
                        <button class="btn" on:click={closeCancel}>Cancel</button>
                        <button class="btn" disabled={!location && !user} on:click={closeConfirm}>Add</button>
                    </div>
                {/if}
            {/await}
        {/if}
    </div>
</div>