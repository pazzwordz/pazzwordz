<script lang="ts">
    import type {SupabaseClient} from "@supabase/supabase-js";
    import type {Database} from "$lib/database.types";
    import {redirect} from "@sveltejs/kit";
    import {goto} from "$app/navigation";

    export let supabase: SupabaseClient<Database>;

    async function  signOut() {
        await supabase.auth.signOut()
        goto("/")
    }
</script>


<div class="sticky top-4 navbar bg-base-200 rounded-md">
    <div class="flex-1">
        <a class="btn btn-ghost normal-case text-xl">PAZZWORDZ</a>
    </div>
    <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
            <li><a>Link</a></li>
            <li>
                <details>
                    <summary>
                        Parent
                    </summary>
                    <ul class="p-2 bg-base-100">
                        <li><a>Link 1</a></li>
                        <li><a>Link 2</a></li>
                    </ul>
                </details>
            </li>
            <button on:click={signOut}>Sign Out</button>
        </ul>
    </div>
</div>