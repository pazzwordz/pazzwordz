<script>
    import Hero from "$lib/components/Hero.svelte";
    import Stats from "$lib/components/Stats.svelte";
    import {routes} from "$lib/navRoutes";
    import Features from "$lib/components/Features.svelte";
    import Pricing from "$lib/components/Pricing.svelte";

    export let data

    const handleSignOut = async () => {
        await data.supabase.auth.signOut()
    }

</script>

<svelte:head>
    <title>Pazzwordz | Home</title>
</svelte:head>

<Hero/>

<Stats/>

<Features/>

<a id="pricing"/>
<Pricing/>
