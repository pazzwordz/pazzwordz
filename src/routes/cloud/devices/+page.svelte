<script lang="ts">
    import type {PageData} from "./$types";
    import {routes} from "$lib/navRoutes";
    import type {Row} from "$lib/database";
    import {onMount} from "svelte";

    type DeviceEntry = Row<"DeviceEntry">
    let decryptedEntries = new Map<string, string>();
    export let data: PageData;
    const userId = data.session!.user.id;

    let entries = new Array<DeviceEntry>;

    onMount(() => {
        refreshEntries();
    })


    async function refreshEntries() {
        entries = new Array<DeviceEntry>();
        const {data: passwordEntries} = await data.supabase.from("DeviceEntry").select("*")
        entries = passwordEntries!;
    }

    let vaultKeyInput: string | undefined;


</script>

<div class="w-full flex gap-4 p-8 h-[80vh]">
    <div class="lg:w-1/5 flex flex-col items-center gap-4">
        <a class="btn w-64 btn-outline flex gap-2 items-center" href={routes.cloud}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="stroke-current" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"/>
            </svg>
            <span>Back</span>
        </a>
        <div class="flex flex-col gap-4 h-[75%] overflow-y-scroll no-scrollbar">
            <input class="input input-bordered join-item w-64" bind:value={vaultKeyInput} placeholder="Search"/>
            <div class="join">
                <button class="btn join-item pointer-events-none">View</button>
                <select class="select select-bordered join-item w-full">
                    <option selected>List</option>
                    <option>Cards</option>
                </select>
            </div>
        </div>
        <button class="btn btn-success btn-outline w-64">Add Pazzword</button>
    </div>
    <div class="divider divider-vertical lg:divider-horizontal"/>
    <div class="w-full relative">
        <h2 class="text-4xl font-bold">Device Info</h2>
        <div class=" h-[95%] overflow-y-scroll">
            <table class="table table-zebra">
                <thead>
                <tr>
                    <td>Name</td>
                    <td>Description</td>
                    <td>Password</td>
                </tr>
                </thead>
                <tbody>
                {#each entries as entry}
                    <tr>
                        <td>{entry.name}</td>
                        <td>{entry.description}</td>
                        <td>
                            {#if decryptedEntries.has(entry.id)}
                                {decryptedEntries.get(entry.id)}
                            {:else }
                                <div>
                                    <button on:click={() => decrypt(entry)}>Decrypt</button>
                                </div>
                            {/if}
                        </td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>