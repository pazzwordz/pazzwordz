<script lang="ts">
    import GenPw from "$lib/components/GenPw.svelte";
    import {onMount} from "svelte";
    import {type ImportedPassword, importFromCsv} from "$lib/scripts/passwordImporter";
    import {decryptHex, deriveKey, encryptText} from "$lib/scripts/crypto";


    let isModalOpen = false
    type Callback = (importedPasswords: Array<ImportedPassword>) => void;

    let inputElement: HTMLInputElement;
    let callback: Callback
    let errorMessage: string | undefined = undefined;

    export function show(cb: Callback) {
        isModalOpen = true;
        callback = cb;
    }

    async function readFile() {
        const file = inputElement.files![0];
        let content = "";
        if(file.name.endsWith(".pazz")) {
            const textDecoder = new TextDecoder('utf-8');
            const buffer = await file.arrayBuffer();
            const contentEncrypted = textDecoder.decode(buffer);
            content = decryptHex(contentEncrypted, deriveKey("supersecretkey", "supersecretsalt"))
        } else {
            content =  await file!.text()
        }
        try {
            const data = importFromCsv(content)
            closeConfirm(data);
        } catch(e: any) {
            errorMessage = e.message;
        }
    }

    function closeConfirm(data: Array<ImportedPassword>) {
        isModalOpen = false;
        inputElement.files = null;
        inputElement.value = "";
        errorMessage = undefined;
        callback(data);
    }

    function closeCancel() {
        isModalOpen = false;
        inputElement.files = null;
        inputElement.value = "";
        errorMessage = undefined;
    }
</script>

<div class="modal" class:modal-open={isModalOpen}>
    <div class="modal-box">
        <h3 class="font-bold text-2xl">Import Passwords</h3>
        {#if errorMessage}
            <div class="alert alert-error">{errorMessage}</div>
        {/if}
        <input type="file" class="file-input file-input-bordered file-input-info max-w-xs w-full"
               accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                application/vnd.ms-excel, .pazz" bind:this={inputElement}/>
        <div class="modal-action">
            <button class="btn" on:click={closeCancel}>Cancel</button>
            <button class="btn btn-success btn-outline" disabled={!inputElement || !inputElement.files} on:click={readFile}>Pazzwordz</button>
        </div>
    </div>
</div>