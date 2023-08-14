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
    <meta name="description" content="Use this free secure password storage to securely store passwords on your local device.">
    <meta name="keywords" content="pazzwordz.io, data privacy, password manager, secure password, pazzwordz, local storage">
</svelte:head>
<Vault/>
