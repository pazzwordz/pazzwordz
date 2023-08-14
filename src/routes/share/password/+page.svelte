<script lang="ts">
    import {copyToClipboard} from "$lib/scripts/functions";
    import {faCopy} from "@fortawesome/free-solid-svg-icons";
    import Tooltip from "$lib/components/Tooltip.svelte";
    import Fa from "svelte-fa";
    import {decryptHex, deriveKey, encryptText} from "$lib/scripts/crypto";
    import {goto} from "$app/navigation";
    import {routes, successToastTheme} from "$lib/config";
    import ShareToVaultModal from "$lib/modals/ShareToVaultModal.svelte";
    import {DataLayerCloud} from "$lib/persistent/DataLayer";
    import {vaultKeyStoreCloud} from "$lib/stores";
    import {toast} from "@zerodevx/svelte-toast";
    import {onMount} from "svelte";

    export let data;
    let isLoading = false;

    let shareToVaultModal: ShareToVaultModal;
    let passwordText: string | undefined = undefined;
    let errorMessage: string | undefined = undefined;

    const delay = (delayInms: number) => {
        return new Promise(resolve => setTimeout(resolve, delayInms));
    }

    function parse(text: string): Uint8Array | null {
        const obj = JSON.parse(text);
        if (obj == null)
            return null;
        return new Uint8Array(obj);
    }

    async function decryptPassword() {
        isLoading = true;
        const response = await fetch(`/share/password/getencrypted?id=${data.id}`);
        if (response.ok) {
            const encrypted = await response.text();
            passwordText = decryptHex(encrypted, parse(atob(data.key))!);
            await delay(500);
        } else {
            await delay(500);
            errorMessage = "Invalid Link!"
        }
        isLoading = false;
    }

    let wasSavedToVault = false;

    async function saveToVault() {
        const dataLayer = new DataLayerCloud(data.supabase, data.session!.user.id)
        shareToVaultModal.show(async (location, user) => {
            await dataLayer.createPasswordEntry($vaultKeyStoreCloud!, passwordText!, location, user);
            wasSavedToVault = true;
            toast.push("Added to vault", {theme: successToastTheme})
        }, dataLayer, data.pwUser, data.pwLocation)
    }
</script>

<ShareToVaultModal bind:this={shareToVaultModal}/>

<h2 class="text-5xl font-bold text-center mt-8 mb-20 w-full">A Password was Shared with you</h2>
{#if errorMessage != undefined}
    <div class="alert alert-error mb-8 font-medium">{errorMessage}</div>
{/if}
<div class="flex flex-col gap-6 w-full h-full">
    <div class="flex flex-col items-center gap-2">
        <div class="bg-base-100 text-md lg:text-5xl rounded-xl flex items-center gap-4 lg:py-8 pl-4 lg:pl-8 lg:pr-4 mb-4">
            <div class="flex items-center justify-center min-w-[13rem]">
                {#if isLoading}
                    <span class="loading loading-dots loading-md"/>
                {:else }
                    <span>{passwordText ?? "••••••••••••••••"}</span>
                {/if}
            </div>
            <Tooltip text="Copy" class="relative">
                <button class="btn btn-ghost" on:click={() => copyToClipboard(passwordText)} disabled={passwordText == undefined}>
                    <Fa icon={faCopy} class="text-3xl"/>
                </button>
            </Tooltip>
        </div>
        {#if !data.session}
            <a class="link mb-4" href={routes.auth.login}>Login to save this password to your vault</a>
            <button class="btn btn-success btn-lg w-48" disabled={passwordText != undefined || isLoading} on:click={decryptPassword}>
                Decrypt
            </button>
        {:else}
            <div class="join justify-center">
                <button class="join-item btn btn-success btn-lg" disabled={passwordText != undefined || isLoading} on:click={decryptPassword}>
                    Decrypt
                </button>
                <button class="join-item btn btn-outline btn-success btn-lg"
                        disabled={passwordText == undefined} on:click={saveToVault}>Save To Vault
                </button>
            </div>
        {/if}
    </div>
</div>
