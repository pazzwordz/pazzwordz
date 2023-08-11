<script lang="ts">

    let masterPasswordSet = true

    let vaults = [{name: "Vault 1"}, {name: "Vault 1"}, {name: "Vault 1"}, {name: "Vault 1"}, {name: "Vault 1"}, {name: "Vault 1"}, {name: "Vault 1"}, {name: "Vault 1"}, {name: "Vault 1"}, {name: "Vault 1"}, {name: "Vault 1"},];
</script>

<div class="w-full flex gap-4 relative p-8 h-[85vh]">
    {#if !masterPasswordSet}
        <div class="absolute top-0 left-0 bg-base-100/80 w-full h-full flex flex-col gap-8 items-center justify-center">
            <b class="text-4xl">Master Password Not Set</b>
            <div class="join">
                <div>
                    <div>
                        <input class="input input-bordered join-item" placeholder="Vault Key"/>
                    </div>
                </div>
                <button class="btn join-item">Unlock</button>
            </div>
        </div>
    {/if}
    <div class="w-1/5 flex flex-col items-center gap-4">
        <h2 class="text-4xl font-bold text-start w-full">Vaults</h2>
        <div class="flex flex-col gap-4 h-[75%] overflow-y-scroll no-scrollbar">
            {#each vaults as vault}
                <button class="btn btn-outline w-64">{vault.name}</button>
            {/each}
        </div>
        <button class="btn bg-base-100 w-64">+ Create Vault</button>
        <button class="btn btn-success btn-outline w-64">Add Pazzword</button>
    </div>
    <div class="divider divider-horizontal"/>
    <div class="w-full">
        <h2 class="text-4xl font-bold">Your Pazzwordz</h2>
        <div class=" h-[95%] overflow-y-scroll">

        </div>
    </div>
</div>