<script lang="ts">
    import type {SupabaseClient} from "@supabase/supabase-js";
    import type {Database} from "$lib/database.types";
    import {redirect} from "@sveltejs/kit";
    import {goto} from "$app/navigation";
    import {routes} from "$lib/navRoutes";

    export let supabase: SupabaseClient<Database>;

    async function signOut() {
        await supabase.auth.signOut()
        goto("/")
    }
</script>


<div class="sticky top-0 z-10">
    <div class="h-4 bg-black/80 w-full"/>
    <div class="navbar bg-base-100 rounded-md">
        <div class="flex-1">
            <a class="btn btn-ghost normal-case text-xl" href="/">PAZZWORDZ</a>
        </div>
        <div class="flex-none">
            <ul class="menu menu-horizontal px-1">
                <li><a href={routes.local}>Local</a></li>
                <li><a href={routes.cloud}>Cloud</a></li>
                <li>
                    <button on:click={signOut}>Sign Out</button>
                </li>
            </ul>
        </div>
    </div>
</div>
