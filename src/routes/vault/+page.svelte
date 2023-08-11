<script lang="ts">
    import type {SupabaseClient} from "@supabase/supabase-js";
    import type {Database} from "$lib/database.types";
    import {goto} from "$app/navigation";

    let vaultKey: string;
    export let data: PageData;

    let errorMessage: string;
    async function unlockVault() {
        const supabase = data.supabase as SupabaseClient<Database>;
        const response = await supabase.from("VaultKey").select("vaultKeyHash").eq("id", data.session.user.id)
        const realVaultKey = response.data![0].vaultKeyHash
        if(vaultKey == realVaultKey)
            goto("/vault/unlocked")
        else
            errorMessage = "INVALID KEY"
    }
</script>
<div>
    <div>{errorMessage}</div>
    <label>Vault Key</label>
    <input type="password" placeholder="******" bind:value={vaultKey}>
    <button on:click={unlockVault}>Unlock</button>
</div>