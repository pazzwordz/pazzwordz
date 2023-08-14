<script lang="ts">
    import {createEventDispatcher, onMount} from 'svelte';
    import {copyToClipboard} from "$lib/scripts/functions";
    import {faCopy} from "@fortawesome/free-solid-svg-icons";
    import Tooltip from "$lib/components/Tooltip.svelte";
    import Fa from "svelte-fa";

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

<div class="flex flex-col gap-6 w-full h-full">
    <div class="w-full flex items-center justify-center">
        <div>{length}</div>
    </div>
    <input type="range" min="8" max="26" class="range" bind:value={length} on:input={() => generatePassword()}/>
    <button class="btn btn-success" on:click={generatePassword}>Generate</button>
    <div class="flex flex-col items-center gap-2">
        <div class="bg-base-200 text-md lg:text-xxl rounded-xl flex items-center gap-4 py-2 pl-4 pr-2">
            <span>{generatedPassword}</span>
            <Tooltip text="Copy" class="relative">
                <button class="btn btn-ghost"
                        on:click={() => copyToClipboard(generatedPassword)}>
                    <Fa icon={faCopy} class="text-3xl"/>
                </button>
            </Tooltip>
        </div>
    </div>
</div>
