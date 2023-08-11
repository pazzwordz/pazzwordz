<script lang="ts">
    import {generateOtpKey, sha256HashHex} from "$lib/crypto.js";
    import {goto} from "$app/navigation";
    import {otpKeyStore, vaultKeyStore} from "$lib/stores.js";
    import type {SupabaseClient} from "@supabase/supabase-js";
    import type {Database} from "$lib/database.types";

    export let supabase: SupabaseClient<Database>
    export let userId: string

    let errorMessage: string;
    let visible = false;
    let inputVaultKey: string;


    export function show() {
        visible = true;
    }

    async function isValidVaultKeyHash(hash: string) {
        const response = await supabase.from("VaultKey").select("vaultKeyHash").eq("id", userId)
        const realVaultKey = response.data![0].vaultKeyHash
        return hash == realVaultKey;
    }

    async function unlockVault() {
        if (await isValidVaultKeyHash(sha256HashHex(inputVaultKey))) {
            goto("/vault/unlocked")
            const otpKey = generateOtpKey();
            vaultKeyStore.set(inputVaultKey);
            otpKeyStore.set(otpKey)
            visible = false
        } else {
            errorMessage = "INVALID KEY"
        }
    }
</script>
<dialog class="modal">
    <h3 class="font-bold text-lg">Vault Unlocking!</h3>
    {#if errorMessage}
        <div>{errorMessage}</div>
    {/if}
    <label>Vault Key</label>
    <input type="password" placeholder="******" bind:value={inputVaultKey}>
    <button on:click={unlockVault}>Unlock</button>
    <button class="btn" on:click={() => visible = false}>Close</button>
</dialog>