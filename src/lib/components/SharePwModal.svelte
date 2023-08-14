<script lang="ts">
    import type {SupabaseClient} from "@supabase/supabase-js";
    import type {Database} from "$lib/database.types";
    import {v4 as uuidv4} from "uuid";
    import type {DataLayer} from "$lib/persistent/DataLayer";
    import {deriveKey, encryptText} from "$lib/crypto";
    import Fa from "svelte-fa";
    import {faClipboard, faShare} from "@fortawesome/free-solid-svg-icons";
    import {copyToClipboard} from "$lib/functions";

    let isModalOpen = false


    export let supabase: SupabaseClient<Database>;
    export let userId: string;
    let expiresIn: number = 60 * 60 * 1000;

    type Callback = () => void;

    let password: string;
    let generatedLink: string | undefined;


    export function show(pw: string) {
        isModalOpen = true;
        password = pw;
    }

    function close() {
        isModalOpen = false;
        generatedLink = undefined;
        password = ""
    }

    async function onCreateLink() {
        const key = deriveKey(uuidv4(), userId)
        const encryptedPw = encryptText(password, key)
        const array = Array.from(key);
        const jsonStr = JSON.stringify(array)
        const keyb64 = btoa(jsonStr);
        const entryId = uuidv4();
        await supabase.from("SharedPasswords").insert({
            id: entryId,
            encrypted: encryptedPw,
            expiresAt: new Date(Date.now() + expiresIn).toISOString()
        })
        generatedLink = `https://pazzwordz.io/share/password?id=${entryId}&key=${keyb64}`
    }

    function copyLink() {
        copyToClipboard(generatedLink!)
    }

    function timeFormatter(delta: number) {
        const newDateTime = new Date(Date.now() + delta);
        const formatter = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
        return formatter.format(newDateTime);
    }
</script>

<div class="modal" class:modal-open={isModalOpen}>
    <div class="modal-box">
        <h3 class="font-bold text-lg">Share Password</h3>
        <div>This will create a one time magic share link</div>
        {#if generatedLink == undefined}
            <select>
                <option>in 1 Minute</option>
                <option>Today {timeFormatter(60 * 60 * 1000)}</option>
                <option>Tomorrow {timeFormatter(60 * 60 * 24 * 1000)}</option>
            </select>
            <button class="btn" on:click={onCreateLink}>Create</button>
        {:else}
            <div class="bg-base-200">{generatedLink}</div>
            <Fa icon={faClipboard} on:click={copyLink}></Fa>
        {/if}
        <div class="modal-action">
            <button class="btn" on:click={close}>Cancel</button>
        </div>
    </div>
</div>