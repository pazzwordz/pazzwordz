<script lang="ts">
    import type {PageData} from "./$types";
    import Vault from "$lib/components/Vault.svelte";
    import {DataLayerCloud} from "$lib/persistent/DataLayer";
    import {onMount} from "svelte";
    import {getDeviceByFingerprint, getUserData, getUserMainDevice} from "$lib/scripts/functions";
    import {fingerprintStore} from "$lib/stores";
    import ConfirmModal from "$lib/modals/ConfirmModal.svelte";
    import {goto} from "$app/navigation";
    import {routes} from "$lib/config";

    export let data: PageData;

    let confirmModal: ConfirmModal
    let locked = false;

    function getUserId() {
        return data.session!.user.id;
    }

    function showLockedModal() {
        confirmModal.show(() => {
            goto(routes.cloud.cloudDevices)
        }, undefined, {
            header: "Not your main device",
            description: "This is not your main device. Buy premium to use cloud on multiple devices or switch your main device",
            confirm: "Devices",
            cancel: undefined
        })
    }

    onMount(async () => {
        const userId = data.session!.user.id;
        const userData = await getUserData(data.supabase, userId)
        if (!userData.premium && data.mainFingerprint != $fingerprintStore) {
            locked = true
            showLockedModal();
        }
    })
</script>
<svelte:head>
    <title>Pazzwordz | Vault</title>
</svelte:head>
<ConfirmModal bind:this={confirmModal}/>
{#if !locked}
    <Vault supabase={data.supabase} userId={getUserId()} hasPremium={data.hasPremium} isCloud={true}/>
{/if}