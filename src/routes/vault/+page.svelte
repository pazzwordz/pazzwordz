<script lang="ts">
    import type {SupabaseClient} from "@supabase/supabase-js";
    import type {Database} from "$lib/database.types";
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";
    import {vaultKeyStore} from "$lib/stores";

    let inputVaultKey: string;
    export let data: PageData;

    onMount(async () => {
        if (await isValidVaultKey($vaultKeyStore)) {
            goto("/vault/unlocked")
            $vaultKeyStore = inputVaultKey;
        }
    })

    let errorMessage: string;

    async function isValidVaultKey(key: string) {
        const supabase = data.supabase as SupabaseClient<Database>;
        const response = await supabase.from("VaultKey").select("vaultKeyHash").eq("id", data.session.user.id)
        const realVaultKey = response.data![0].vaultKeyHash
        return key == realVaultKey;
    }

    async function unlockVault() {
        if (await isValidVaultKey(inputVaultKey)) {
            goto("/vault/unlocked")
            vaultKeyStore.set(inputVaultKey);
        } else
            errorMessage = "INVALID KEY"
    }
</script>
<div>
    {#if errorMessage}
        <div>{errorMessage}</div>
    {/if}
    <label>Vault Key</label>
    <input type="password" placeholder="******" bind:value={inputVaultKey}>
    <button on:click={unlockVault}>Unlock</button>
</div>