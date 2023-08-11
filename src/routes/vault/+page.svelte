<script lang="ts">
    import type {SupabaseClient} from "@supabase/supabase-js";
    import type {Database} from "$lib/database.types";
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";
    import {otpStore, vaultKeyStore} from "$lib/stores";
    import {deriveKey, sha256HashHex} from "$lib/crypto";
    import * as aesjs from "aes-js";

    let inputVaultKey: string;
    export let data: PageData;
    let errorMessage: string;

    onMount(async () => {
        if ($vaultKeyStore && await isValidVaultKeyHash(sha256HashHex($vaultKeyStore))) {
            goto("/vault/unlocked")
        }
    })


    async function isValidVaultKeyHash(hash: string) {
        const supabase = data.supabase as SupabaseClient<Database>;
        const response = await supabase.from("VaultKey").select("vaultKeyHash").eq("id", data.session.user.id)
        const realVaultKey = response.data![0].vaultKeyHash
        return hash == realVaultKey;
    }

    async function unlockVault() {
        if (await isValidVaultKeyHash(sha256HashHex(inputVaultKey))) {
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