<script lang="ts">
    import type {SupabaseClient} from "@supabase/supabase-js";
    import type {Database} from "$lib/database.types";
    import {goto} from "$app/navigation";
    import {createHash} from "sha256-uint8array";
    import {routes} from "$lib/navRoutes";

    export let data: PageData;

    let loading = false;
    let email = "";
    let password = "";
    let errorMessage = "";

    async function handleSignUp() {
        try {
            loading = true;
            const response = await data.supabase.auth.signUp({
                email,
                password,
            });
            if (response.error) {
                errorMessage = response.error.message;
                console.log(errorMessage)
                throw response.error;
            } else {
                const user = response.data!.user;
                const newId = user.id;
                const supabase = data.supabase as SupabaseClient<Database>;
                //ToDo: salt->hash->pepper->db should be done server side,
                // generate salt and pepper based on user data deterministically
                goto("/login")
            }
        } catch (error) {
        } finally {
            loading = false;
        }
    }
</script>
<svelte:head>
    <title>Pazzwordz | Signup</title>
</svelte:head>

<section class="w-full h-[60vh] flex items-center justify-center">
    <form class="flex flex-col gap-4 w-full max-w-xs" on:submit|preventDefault={handleSignUp}>
        <h1 class="text-3xl font-bold">Sign Up</h1>
        <div class="divider my-0"/>
        <div class="form-control w-full">
            <label class="label" for="username">
                <span class="label-text font-medium">Email</span>
            </label>
            <input type="text" id="username" placeholder="your@email.com" class="input input-bordered w-full"
                   bind:value={email}/>
        </div>
        <div class="form-control w-full">
            <label class="label" for="password">
                <span class="label-text font-medium">Password</span>
            </label>
            <input type="password" id="password" placeholder="••••••••" class="input input-bordered w-full"
                   bind:value={password}/>
        </div>
        <button type="submit" class="btn btn-outline btn-primary w-full">Sign up</button>
    </form>
</section>
<!--<section class="w-full h-screen flex items-center justify-center overflow-clip">-->
<!--    <div class="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">-->
<!--        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">-->
<!--            <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">-->
<!--                Sign Up-->
<!--            </h1>-->
<!--            {#if errorMessage != ""}-->
<!--                <div class="p-4 bg-red-500 font-medium text-white my-2 rounded-md">-->
<!--                    {errorMessage}-->
<!--                </div>-->
<!--            {/if}-->
<!--            <form-->
<!--                    class="space-y-4 md:space-y-6"-->
<!--                    action="#"-->
<!--                    on:submit|preventDefault={handleSignUp}>-->
<!--                <div>-->
<!--                    <label for="email" class="block mb-2 text-sm font-medium text-white"-->
<!--                    >Email</label>-->
<!--                    <input-->
<!--                            type="email"-->
<!--                            name="email"-->
<!--                            id="email"-->
<!--                            bind:value={email}-->
<!--                            class="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"-->
<!--                            placeholder="name@company.com"/>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <label-->
<!--                            for="password"-->
<!--                            class="block mb-2 text-sm font-medium text-white">Password</label>-->
<!--                    <input-->
<!--                            type="password"-->
<!--                            name="password"-->
<!--                            id="password"-->
<!--                            bind:value={password}-->
<!--                            placeholder="••••••••"-->
<!--                            class="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <label-->
<!--                            for="vaultkey"-->
<!--                            class="block mb-2 text-sm font-medium text-white">Vault Key</label>-->
<!--                    <input-->
<!--                            type="password"-->
<!--                            name="vaultkey"-->
<!--                            id="vaultkey"-->
<!--                            bind:value={vaultPassword}-->
<!--                            placeholder="••••••••"-->
<!--                            class="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block-->
<!--                            w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500-->
<!--                            focus:border-blue-500"/>-->
<!--                </div>-->
<!--                <button-->
<!--                        type="submit"-->
<!--                        class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none-->
<!--                        focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600-->
<!--                         hover:bg-primary-700 focus:ring-primary-800"-->
<!--                >Sign up-->
<!--                </button>-->
<!--            </form>-->
<!--        </div>-->
<!--    </div>-->
<!--</section>-->

<style>
</style>
