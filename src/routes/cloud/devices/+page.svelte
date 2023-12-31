<script lang="ts">
    import type {PageData} from "./$types";
    import {routes} from "$lib/config";
    import type {Row} from "$lib/types";
    import {onMount} from "svelte";
    import {fingerprintStore} from "$lib/stores";

    type DeviceEntry = Row<"DeviceEntry">
    export let data: PageData;
    let entries = new Array<DeviceEntry>;
    let mainDeviceId: string;
    let selectedDevice: DeviceEntry;

    onMount(() => {
        refreshEntries();
    })

    async function refreshEntries() {
        entries = new Array<DeviceEntry>();
        const res = await data.supabase.from("DeviceEntry").select("*")
        entries = res.data!
        mainDeviceId = await getMainDeviceId();
    }

    async function getMainDeviceId() {
        const res = await data.supabase.from("UserData").select("mainDeviceId").single();
        return res.data!.mainDeviceId!;
    }

    function getDeviceData(device: DeviceEntry) {
        return device.data as any
    }

</script>

<svelte:head>
    <title>Pazzwordz | Devices</title>
</svelte:head>

<div class="w-full flex flex-col lg:flex-row gap-4 lg:p-8 h-[80vh]">
    <div class="lg:w-1/5 flex flex-col items-center gap-4">
        <a class="btn w-64 btn-outline flex gap-2 items-center" href={routes.cloud.cloud}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="stroke-current" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"/>
            </svg>
            <span>Back</span>
        </a>
        {#each entries as device, i}
            {#if device.id == mainDeviceId}
                <div class="indicator">
                    <span class="indicator-item badge badge-primary">main</span>
                    <button class="btn w-64" on:click={() => {selectedDevice = device}}>
                        Device {i}
                    </button>
                </div>
            {:else }
                {#if device.fingerprint === $fingerprintStore}
                    <div class="indicator">
                        <span class="indicator-item badge badge-secondary">current</span>
                        <button class="btn w-64" on:click={() => {selectedDevice = device}}>
                            Device {i}
                        </button>
                    </div>
                {:else }
                    <button class="btn w-64" on:click={() => {selectedDevice = device}}>
                        Device {i}
                    </button>
                {/if}
            {/if}
        {/each}
    </div>
    <div class="divider divider-vertical lg:divider-horizontal"/>
    <div class="w-full relative">
        <h2 class="text-4xl font-bold">Device Info</h2>
        <div class="h-[95%] overflow-y-scroll">
            {#if selectedDevice}
                <div>
                    <b>IP-Address</b>
                    {getDeviceData(selectedDevice)["ip"]}
                </div>
                <div>
                    <b>Location</b>
                    {getDeviceData(selectedDevice)["loc"]} - {getDeviceData(selectedDevice)["colo"]}
                </div>
                <div>
                    <b>User-Agent</b>
                    {getDeviceData(selectedDevice)["uag"]}
                </div>
                <div>
                    <b>Device-Fingerprint</b>
                    {selectedDevice.fingerprint}
                </div>
            {/if}
        </div>
    </div>
</div>