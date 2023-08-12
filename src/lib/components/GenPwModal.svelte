<script lang="ts">
    import {text} from "@sveltejs/kit";

    let isModalOpen = false
    let thisOnConfirm: Callback;

    type Callback = (password: string) => void;
    let generatedPassword: string;
    let length: number
    let useSpecialCharacters: boolean

    export function show(onConfirm: Callback) {
        generatedPassword = "";
        length = 14
        useSpecialCharacters = true
        isModalOpen = true;
        thisOnConfirm = onConfirm;
    }

    function closeConfirm() {
        isModalOpen = false;
        thisOnConfirm(generatedPassword)
    }

    function closeCancel() {
        isModalOpen = false;
    }


    async function generatePassword() {
        const buffer = new Uint8Array(length);
        const crypto = window.crypto || (window as any).msCrypto; // For compatibility with IE11.
        const array = await crypto.getRandomValues(buffer);
        let password = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        if (useSpecialCharacters)
            characters += "!§$%&/()=?"
        for (let i = 0; i < length; i++) {
            password += characters.charAt(array[i] % characters.length);
        }
        generatedPassword = password;
    }
</script>

<div class="modal" class:modal-open={isModalOpen}>
    <div class="modal-box">
        <h3 class="font-bold text-lg">Generate Password</h3>
        <div class="flex gap-4">
            <label>Length</label>
            <input type="number" bind:value={length}>
            <label>Special Characters</label>
            <input type="checkbox" bind:value={useSpecialCharacters}>
            <button on:click={generatePassword}>Generate</button>
        </div>
        <div>{generatedPassword}</div>
        <div class="modal-action">
            <button class="btn" on:click={closeCancel}>Cancel</button>
            <button class="btn" on:click={closeConfirm}>Pazzwordz</button>
        </div>
    </div>
</div>