<script lang="ts">
    import Hero from "$lib/components/Hero.svelte";
    import Stats from "$lib/components/Stats.svelte";
    import {routes} from "$lib/config";
    import Features from "$lib/components/Features.svelte";
    import Pricing from "$lib/components/Pricing.svelte";

    export let data: PageData
</script>

<svelte:head>
    <title>Pazzwordz.io | Free Open-Source Password Manager</title>
    <meta name="description" content="Generate and manage your passwords securely with Pazzwordz.io. Create strong, unique passwords for your online accounts.">
    <meta name="keywords" content="password generator, password manager, online security, strong passwords, pazzwordz.io, pazzwordz">
</svelte:head>

<Hero/>

<Stats stats={data.stats}/>

<Features/>

<a id="pricing"/>
<Pricing/>
