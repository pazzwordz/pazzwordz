<script lang="ts">
    import {text} from "@sveltejs/kit";

    let isModalOpen = false
    let thisParams: any;
    let thisOnConfirm: Callback;

    type Callback = (params?: any) => void;

    interface Options {
        header: string,
        description?: string,
        cancel?: string
        confirm: string
    }

    let thisOptions: Options = {
        header: "Confirm",
        description: undefined,
        cancel: "Cancel",
        confirm: "Confirm",
    }

    export function show(onConfirm: Callback, params?: any, options?: Options) {
        thisOptions = options ?? thisOptions
        thisOnConfirm = onConfirm;
        thisParams = params
    }

    function closeConfirm() {
        isModalOpen = false;
        thisOnConfirm(thisParams)
    }

    function closeCancel() {
        isModalOpen = false;
    }

</script>

<div class="modal" class:modal-open={isModalOpen}>
    <div class="modal-box">
        <h3 class="font-bold text-lg">{thisOptions.header}</h3>
        {#if thisOptions.description != undefined}
            <p class="py-4">{thisOptions.description}</p>
        {/if}
        <div class="modal-action">
            {#if thisOptions.cancel != undefined}
                <button class="btn" on:click={closeCancel}>{thisOptions.cancel}</button>
            {/if}
            <button class="btn" on:click={closeConfirm}>{thisOptions.confirm}</button>
        </div>
    </div>
</div>