<script lang="ts">
    import Vault from "$lib/components/Vault.svelte";
    import {onMount} from "svelte";
    // import {PageData} from "./$types"
    export let data: PageData;

    onMount(() => {

    })
</script>
<svelte:head>
    <title>Pazzwordz | Local Vault</title>
</svelte:head>
<Vault/>
