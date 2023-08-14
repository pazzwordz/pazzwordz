<script lang="ts">
    import {createEventDispatcher, onMount} from 'svelte';
    import {copyToClipboard} from "$lib/functions";
    import {faCopy} from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import Tooltip from "$lib/components/Tooltip.svelte";

    const dispatch = createEventDispatcher();

    let generatedPassword: string = "";
    let length = 17

    async function generatePassword() {
        const buffer = new Uint8Array(length);
        const crypto = window.crypto || (window as any).msCrypto; // For compatibility with IE11.
        const array = await crypto.getRandomValues(buffer);
        let password = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!§$%&/()=?';
        for (let i = 0; i < length; i++) {
            password += characters.charAt(array[i] % characters.length);
        }
        generatedPassword = password;
        dispatch("changed", {password: generatedPassword})
    }

    onMount(generatePassword);

</script>

<svelte:head>
    <title>Pazzwordz | Password Generator</title>
    <meta name="description" content="Generate a secure password in seconds with our password generator!">
    <meta name="keywords" content="pazzwordz.io, password manager, password generator, secure password, pazzwordz">
</svelte:head>

<h2 class="text-5xl font-bold text-center mt-8 mb-20 w-full">Generate a secure Password</h2>

<div class="flex flex-col gap-6 w-full h-full">

    <div class="w-full flex items-center justify-center font-bold">
        <div class="bg-base-100 p-8 text-3xl rounded-xl">
            {length}
        </div>
    </div>
    <input type="range" min="8" max="26" class="range" bind:value={length} on:input={() => generatePassword()}/>
    <div class="flex flex-col items-center gap-2">
        <div class="bg-base-100 text-md lg:text-5xl rounded-xl flex items-center gap-4 lg:py-8 pl-4 lg:pl-8 lg:pr-4">
            <span>{generatedPassword}</span>
            <Tooltip text="Copy" class="relative">
                <button class="btn btn-ghost"
                        on:click={() => copyToClipboard(generatedPassword)}>
                    <Fa icon={faCopy} class="text-3xl"/>
                </button>
            </Tooltip>
        </div>
    </div>
    <button class="btn btn-success btn-lg" on:click={generatePassword}>Generate</button>
</div>
