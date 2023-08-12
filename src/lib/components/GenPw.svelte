<script lang="ts">
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    let generatedPassword: string = "";
    let length = 16

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
</script>

<div class="flex flex-col gap-6 w-full h-full">
    <div class="w-full flex items-center justify-center">
        <div>{length}</div>
    </div>
    <input type="range" min="8" max="26" class="range" bind:value={length}
           on:change={() => generatePassword()}/>
    <button class="btn btn-success" on:click={generatePassword}>Generate</button>
    <div class="flex gap-2">
        <div>Your Password:</div>
        <div>{generatedPassword}</div>
    </div>
</div>
