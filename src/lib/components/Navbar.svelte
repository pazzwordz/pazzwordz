<script lang="ts">
    import type {Session, SupabaseClient} from "@supabase/supabase-js";
    import type {Database} from "$lib/database.types";
    import {redirect} from "@sveltejs/kit";
    import {goto} from "$app/navigation";
    import {routes} from "$lib/navRoutes";
    import {toast} from "@zerodevx/svelte-toast";
    import {successToastTheme} from "$lib/config";

    export let supabase: SupabaseClient<Database>;
    export let session: Session | null;

    async function signOut() {
        await supabase.auth.signOut();
        toast.push("Signed Out", {theme: successToastTheme})
        goto("/")
    }
</script>

<div class="sticky top-0 z-10">
    <div class="h-4 bg-black/80 w-full"/>
    <div class="navbar bg-base-100 rounded-md">
        <div class="navbar-start">
            <div class="dropdown">
                <label tabindex="-1" class="btn btn-ghost lg:hidden" for="">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"/>
                    </svg>
                </label>
                <ul tabindex="-1" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a href="/">Home</a></li>
                    <div class="divider my-0"/>
                    <li><a href={routes.pricing}>Pricing</a></li>
                    <div class="divider my-0"/>
                    <li><a href={routes.local}>Local</a></li>
                    <div class="divider my-0"/>
                    <li><a href={routes.cloud.cloud}>Cloud</a></li>
                    <div class="divider my-0"/>
                    <li>
                        {#if session}
                            <button on:click={signOut}>Sign Out</button>
                        {:else }
                            <a href={routes.auth.login}>Sign In</a>
                        {/if}
                    </li>
                </ul>
            </div>
            <a class="btn btn-ghost normal-case text-xl hidden lg:flex" href="/">PAZZWORDZ<span class="text-secondary -mx-1">.io</span></a>
        </div>
        <div class="navbar-end">
            <a class="btn btn-ghost normal-case text-xl lg:hidden" href="/">PAZZWORDZ<span class="text-secondary -mx-1">.io</span></a>
            <ul class="menu menu-horizontal px-1 hidden lg:flex font-medium">
                <li><a href="/">Home</a></li>
                <li><a href={routes.pricing}>Pricing</a></li>
                <li><a href={routes.local}>Local</a></li>
                <li><a href={routes.cloud.cloud}>Cloud</a></li>
                <li>
                    {#if session}
                        <button on:click={signOut}>Sign Out</button>
                    {:else}
                        <a href={routes.auth.login}>Sign In</a>
                    {/if}
                </li>
            </ul>
        </div>
    </div>
</div>

<!--<div class="sticky top-0 z-10">-->
<!--    <div class="h-4 bg-black/80 w-full"/>-->
<!--    <div class="navbar bg-base-100 rounded-md">-->
<!--        <div class="flex-1">-->
<!--            <a class="btn btn-ghost normal-case text-xl" href="/">PAZZWORDZ</a>-->
<!--        </div>-->
<!--        <div class="flex-none">-->
<!--            <ul class="menu menu-horizontal px-1">-->
<!--                <li><a href={routes.local}>Local</a></li>-->
<!--                <li><a href={routes.cloud}>Cloud</a></li>-->
<!--                <li>-->
<!--                    <button on:click={signOut}>Sign Out</button>-->
<!--                </li>-->
<!--            </ul>-->
<!--        </div>-->
<!--    </div>-->
<!--</div>-->
