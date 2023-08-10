<script lang="ts">
    import {get} from "svelte/store";

    export let data: PageData;

    let loading = false;
    let email = "";
    let password = "";
    let errorMessage = "";

    const handleLogin = async () => {
        try {
            loading = true;
            const response = await data.supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (response.error) {
                errorMessage = response.error.message;
            }

        } catch (error) {
        } finally {
            loading = false;
        }
    };
</script>

<section class="w-full h-screen flex items-center justify-center overflow-clip">
    <div
            class="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1
                    class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                Einloggen
            </h1>
            {#if errorMessage != ""}
                <div class="p-4 bg-red-500 font-medium text-white my-2 rounded-md">
                    {errorMessage}
                </div>
            {/if}
            <form
                    class="space-y-4 md:space-y-6"
                    action="#"
                    on:submit|preventDefault={handleLogin}>
                <div>
                    <label for="email" class="block mb-2 text-sm font-medium text-white"
                    >Email</label>
                    <input
                            type="email"
                            name="email"
                            id="email"
                            bind:value={email}
                            class="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                            placeholder="name@company.com"/>
                </div>
                <div>
                    <label
                            for="password"
                            class="block mb-2 text-sm font-medium text-white">Passwort</label>
                    <input
                            type="password"
                            name="password"
                            id="password"
                            bind:value={password}
                            placeholder="••••••••"
                            class="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div class="flex items-center justify-between">
                    <a
                            href="/"
                            class="text-sm font-medium text-primary-600 hover:underline text-primary-500 text-white"
                    >Passwort vergessen?</a>
                </div>
                <button
                        type="submit"
                        class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                >Sign in
                </button>
            </form>
        </div>
    </div>
</section>

<style>
</style>
