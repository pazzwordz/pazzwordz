<script lang="ts">
    import {get} from "svelte/store";
    import type {PageData} from "../../../../.svelte-kit/types/src/routes";
    import {fingerprintStore} from "$lib/stores";
    import {routes} from "$lib/navRoutes";
    import {goto} from "$app/navigation";

    export let data: PageData;

    let email = "";
    let password = "";
    let errorMessage: string | undefined= undefined;

    async function getCloudflareJSON() {
        let data = await fetch('https://1.1.1.1/cdn-cgi/trace').then(res => res.text())
        let arr = data.trim().split('\n').map(e => e.split('='))
        return Object.fromEntries(arr)
    }

    async function handleLogin() {
        let device_data = await getCloudflareJSON();
        const response = await data.supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (response.error) {
            errorMessage = response.error.message;
            return;
        }

        const deviceUpdate = await data.supabase.from("DeviceEntry").upsert({
            userId: response.data.user!.id,
            fingerprint: $fingerprintStore,
            data: device_data
        })


        await goto(routes.cloud.cloud);

    };
</script>

<svelte:head>
    <title>Pazzwordz | Login</title>
</svelte:head>

<section class="w-full h-[60vh] flex items-center justify-center">
    <form class="flex flex-col gap-4 w-full max-w-xs" on:submit|preventDefault={handleLogin}>
        <h1 class="text-3xl font-bold">Login</h1>
        <div class="divider my-0"/>
        {#if errorMessage != undefined}
            <div class="alert alert-error">{errorMessage}</div>
        {/if}
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
        <button type="submit" class="btn btn-outline btn-primary w-full">Sign in</button>
        <div class="flex w-full justify-between font-medium text-sm">
            <a class="link link-hover" href={routes.auth.resetPassword}>Forgot Password</a>
            <a class="link link-hover" href={routes.auth.signUp}>Sign Up</a>
        </div>
    </form>
</section>