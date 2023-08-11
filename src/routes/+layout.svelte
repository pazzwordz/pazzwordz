<script lang="ts">
    import {invalidate} from '$app/navigation'
    import {onMount} from 'svelte'
    import "../app.css"
    import Navbar from "$lib/components/Navbar.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import FingerprintJS from "$lib/scripts/fp.js";
    import {dataLocalStore, fingerprintStore} from "$lib/stores";
    import {DataLayerLocal} from "$lib/DataLayer";

    export let data

    let {supabase, session} = data
    $: ({supabase, session} = data)

    onMount(() => {
        if(!$dataLocalStore)
            $dataLocalStore = new DataLayerLocal();
        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((event, _session) => {
            if (_session?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth')
            }
        });

        const fpPromise = FingerprintJS.load();

        fpPromise
            .then((fp: any) => fp.get())
            .then((result: any) => {
                const visitorId = result.visitorId;
                fingerprintStore.set(visitorId);
            });

        return () => subscription.unsubscribe()
    });
</script>

<div class="relative px-[5vw] lg:px-[10vw] bg-base-300">
    <Navbar supabase={supabase}/>
    <div class="h-12"/>
    <main class="min-h-screen">
        <slot/>
    </main>
</div>
<Footer/>
