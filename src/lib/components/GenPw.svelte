<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    let generatedPassword: string = "";
    let length: number = 20

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

<div>
    <div class="">
        <div class="flex gap-4">
            <label>Length</label>
            <input type="number" bind:value={length}>
            <label>Special Characters</label>
            <button on:click={generatePassword}>Generate</button>
        </div>
        <div>{generatedPassword}</div>
    </div>
</div>