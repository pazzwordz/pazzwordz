<script lang="ts">
    import type {PageData} from "./$types";
    import Vault from "$lib/components/Vault.svelte";
    import {DataLayerCloud} from "$lib/DataLayer";

    export let data: PageData;
    const dataLayer = new DataLayerCloud(data.supabase, data.session!.user.id)

</script>
<Vault dataLayer={dataLayer}/>