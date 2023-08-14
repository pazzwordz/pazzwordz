<script lang="ts">
    import type {PageData} from "./$types";
    import Vault from "$lib/components/Vault.svelte";
    import {DataLayerCloud} from "$lib/persistent/DataLayer";

    export let data: PageData;

    function getUserId() {
        return data.session!.user.id;
    }
</script>
<svelte:head>
    <title>Pazzwordz | Vault</title>
</svelte:head>
<Vault supabase={data.supabase} userId={getUserId()} hasPremium={data.hasPremium} isCloud={true}/>