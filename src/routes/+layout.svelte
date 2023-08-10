<script lang="ts">
    import {invalidate} from '$app/navigation'
    import {onMount} from 'svelte'
    import "../app.css"
    import Navbar from "$lib/components/Navbar.svelte";
    export let data

    let {supabase, session} = data
    $: ({supabase, session} = data)

    onMount(() => {
        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange((event, _session) => {
            if (_session?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth')
            }
        })

        return () => subscription.unsubscribe()
    });
</script>

<div class="relative px-[10vw] bg-base-100 h-[200vh]">
    <Navbar supabase={supabase}/>
    <main>
        <slot/>
    </main>
</div>
