<script lang="ts">
    import {invalidate} from '$app/navigation'
    import {onMount} from 'svelte'
    import "../app.css"
    import Navbar from "$lib/components/Navbar.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import FingerprintJS from "$lib/scripts/fp.js";
    import {fingerprintStore} from "$lib/stores";
    import {DataLayerLocal} from "$lib/persistent/DataLayer";
    import CookieBanner from "$lib/components/CookieBanner.svelte";
    import {page} from "$app/stores";

    export let data

    let {supabase, session} = data
    $: ({supabase, session} = data)

    $: {
        if (typeof gtag !== "undefined") {
            gtag("config", "G-6L1QCX68VN", {
                page_title: document.title,
                page_path: $page.url.pathname,
            });
            gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied'
            });
        }
    }


    onMount(() => {
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
    <Navbar {supabase} {session}/>
    <CookieBanner/>
    <div class="h-12"/>
    <main class="min-h-screen">
        <slot/>
    </main>
</div>
<Footer/>
