<script lang="ts">
    import {get} from "svelte/store";
    import {fingerprintStore} from "$lib/stores";
    import {routes} from "$lib/navRoutes";
    import {goto} from "$app/navigation";

    export let data;

    let email = "";
    let password = "";
    let password2 = "";
    let errorMessage: string | undefined = undefined;

    async function resetPassword() {
        const response = await data.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "https://pazzwordz.io/auth/reset-password"
        });
        if (response.error) {
            errorMessage = response.error.message;
            return;
        }
    }

    async function updatePassword() {
        if (password !== password2) {
            errorMessage = "Passwords dont match!";
            return;
        }
        const response = await data.supabase.auth.updateUser({password: password});
        if (response.error) {
            errorMessage = response.error.message;
            return;
        }
        await goto(routes.cloud.cloud);
    }
</script>

<svelte:head>
    <title>Pazzwordz | Reset Password</title>
</svelte:head>

{#if data.session }
    <section class="w-full h-[60vh] flex items-center justify-center">
        <form class="flex flex-col gap-4 w-full max-w-xs" on:submit|preventDefault={updatePassword}>
            <h1 class="text-3xl font-bold">Update Password</h1>
            <div class="divider my-0"/>
            {#if errorMessage != undefined}
                <div class="alert alert-error">{errorMessage}</div>
            {/if}
            <div class="form-control w-full">
                <label class="label" for="password">
                    <span class="label-text font-medium">New Password</span>
                </label>
                <input type="password" id="password" placeholder="••••••••" class="input input-bordered w-full"
                       bind:value={password}/>
            </div>
            <div class="form-control w-full">
                <label class="label" for="password">
                    <span class="label-text font-medium">Repeat Password</span>
                </label>
                <input type="password" id="password2" placeholder="••••••••" class="input input-bordered w-full"
                       bind:value={password2}/>
            </div>
            <button type="submit" class="btn btn-outline btn-primary w-full">Update Password</button>
            <div class="flex w-full justify-between font-medium text-sm">
                <a class="link link-hover" href={routes.cloud.cloud}>Back</a>
            </div>
        </form>
    </section>
{:else }
    <section class="w-full h-[60vh] flex items-center justify-center">
        <form class="flex flex-col gap-4 w-full max-w-xs" on:submit|preventDefault={resetPassword}>
            <h1 class="text-3xl font-bold">Reset Password</h1>
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
            <button type="submit" class="btn btn-outline btn-primary w-full">Send Reset Link</button>
            <div class="flex w-full justify-between font-medium text-sm">
                <a class="link link-hover" href={routes.auth.login}>Back to login</a>
            </div>
        </form>
    </section>
{/if}
