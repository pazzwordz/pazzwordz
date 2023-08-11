<script lang="ts">
    import Vault from "$lib/components/Vault.svelte";
    import {onMount} from "svelte";
    import {dataLocalStore} from "$lib/stores";
    import {sha256HashHex} from "$lib/crypto";
    // import {PageData} from "./$types"
    export let data: PageData;

    onMount(() => {
        if(!localStorage.getItem("vaultKeyHash")) {
            console.log("initial vault key set")
            localStorage.setItem("vaultKeyHash", sha256HashHex("sussy123"))
        }
    })
</script>
<Vault dataLayer={$dataLocalStore}/>