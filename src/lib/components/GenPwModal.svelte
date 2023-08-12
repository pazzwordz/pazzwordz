<script lang="ts">
    import {text} from "@sveltejs/kit";
    import GenPw from "$lib/components/GenPw.svelte";

    let isModalOpen = false
    let thisOnConfirm: Callback;

    type Callback = (password: string) => void;
    let generatedPassword: string;

    export function show(onConfirm: Callback) {
        generatedPassword = "";
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


    function onPwChanged(event: any) {
        const pw = event.detail.password
        generatedPassword = pw;
    }
</script>

<div class="modal" class:modal-open={isModalOpen}>
    <div class="modal-box h-[60vh] w-[95vw] md:h-[40vh] md:w-[50vw]">
        <h3 class="font-bold text-2xl">Generate Password</h3>
        <div class="mt-6 text-lg" >
            <GenPw on:changed={onPwChanged}/>
        </div>
        <div class="modal-action">
            <button class="btn" on:click={closeCancel}>Cancel</button>
            <button class="btn" on:click={closeConfirm}>Pazzwordz</button>
        </div>
    </div>
</div>