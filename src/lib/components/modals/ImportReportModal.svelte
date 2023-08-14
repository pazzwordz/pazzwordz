<script lang="ts">
    import type {PasswordEntryView} from "$lib/types";

    let isModalOpen = false
    let data = new Array<PasswordEntryView>();
    export function show(dataParam: Array<PasswordEntryView>) {
        data = dataParam
        isModalOpen = true;
    }

    function close() {
        isModalOpen = false;
        data = new Array<PasswordEntryView>();
    }
</script>

<div class="modal" class:modal-open={isModalOpen}>
    <div class="modal-box">
        <h3 class="font-bold text-2xl">Skipped Duplicates</h3>
            <table class="table table-fixed table-zebra overflow-y-scroll w-full max-h-[40vh]">
                <thead>
                <tr>
                    <td>Location</td>
                    <td>User</td>
                </tr>
                </thead>
                <tbody>
                {#each data as entry}
                    <tr>
                        <td>{entry.location}</td>
                        <td>{entry.user}</td>
                    </tr>
                {/each}
                </tbody>
            </table>
        <div class="modal-action">
            <button class="btn" on:click={close}>Cancel</button>
        </div>
    </div>
</div>