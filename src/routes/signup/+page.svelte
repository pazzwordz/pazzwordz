<script lang="ts">
    import type {SupabaseClient} from "@supabase/supabase-js";
    import type {Database} from "$lib/database.types";
    import {goto} from "$app/navigation";
    import {createHash} from "sha256-uint8array";
    import {routes} from "$lib/navRoutes";

    export let data: PageData;

    let inputMail = "";
    let inputPassword = "";
    let errorMessage: string | undefined = undefined;

    async function userExists(email: string) {
        const response = await data.supabase.rpc("user_exists", {email: email})
        return response.data;
    }

    async function handleSignUp() {
        if (await userExists(inputMail)) {
            errorMessage = "Email already in use"
            return;
        }

        const response = await data.supabase.auth.signUp({
            email: inputMail,
            password: inputPassword,
        });

        if (response.error) {
            errorMessage = response.error.message;
            return;
        }
        const user = response.data!.user;
        const newId = user.id;
        goto("/login")

    }
</script>
<svelte:head>
    <title>Pazzwordz | Signup</title>
</svelte:head>

<section class="w-full h-[60vh] flex items-center justify-center">
    <form class="flex flex-col gap-4 w-full max-w-xs" on:submit|preventDefault={handleSignUp}>
        <h1 class="text-3xl font-bold">Sign Up</h1>
        <div class="divider my-0"/>
        {#if errorMessage != undefined}
            <div class="alert alert-error">{errorMessage}</div>
        {/if}
        <div class="form-control w-full">
            <label class="label" for="username">
                <span class="label-text font-medium">Email</span>
            </label>
            <input type="text" id="username" placeholder="your@email.com" class="input input-bordered w-full"
                   bind:value={inputMail}/>
        </div>
        <div class="form-control w-full">
            <label class="label" for="password">
                <span class="label-text font-medium">Password</span>
            </label>
            <input type="password" id="password" placeholder="••••••••" class="input input-bordered w-full"
                   bind:value={inputPassword}/>
        </div>
        <button type="submit" class="btn btn-outline btn-primary w-full">Sign up</button>
        <div class="flex w-full justify-between font-medium text-sm">
            <a class="link link-hover" href={routes.auth.login}>Back to login</a>
        </div>
    </form>
</section>
<style>
</style>
