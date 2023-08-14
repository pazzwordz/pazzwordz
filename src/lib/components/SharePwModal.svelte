<script lang="ts">
    import type {SupabaseClient} from "@supabase/supabase-js";
    import type {Database} from "$lib/database.types";
    import {v4 as uuidv4} from "uuid";
    import type {DataLayer} from "$lib/persistent/DataLayer";
    import {deriveKey, encryptText} from "$lib/crypto";
    import Fa from "svelte-fa";
    import {faClipboard, faKey, faShare} from "@fortawesome/free-solid-svg-icons";
    import {copyToClipboard} from "$lib/functions";
    import Tooltip from "$lib/components/Tooltip.svelte";

    let isModalOpen = false


    export let supabase: SupabaseClient<Database>;
    export let userId: string;
    let expiresIn: number = 3600000;

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
    <div class="modal-box ">
        <h3 class="font-bold text-lg">Share Password</h3>
        <p class="py-4">This will create a one time magic share link.</p>
        {#if generatedLink == undefined}
            <div class="join my-4">
                <div class="btn join-item pointer-events-none">Expires In</div>
                <select class="select select-bordered join-item w-48 lg:w-max" bind:value={expiresIn}>
                    <option value={60000}>1 Minute</option>
                    <option selected value={3600000}>1 Hour (Today {timeFormatter(60 * 60 * 1000)})</option>
                    <option value={86400000}>24 Hours (Tomorrow {timeFormatter(60 * 60 * 24 * 1000)})</option>
                </select>
            </div>
        {:else}
            <div class="join">
                <input class="input input-bordered join-item lg:w-80" bind:value={generatedLink}/>
                <button class="btn join-item" on:click={() => copyToClipboard(generatedLink+"")}>
                    <Fa icon={faClipboard}/>
                    Copy Link
                </button>
            </div>
            <!--            <div class="join">-->
            <!--                <input class=" join-item input bg-base-200 input-bordered w-full" placeholder="Password" bind:value={generatedLink}/>-->
            <!--                <Tooltip text="Generate Password" class="">-->
            <!--                    <button type="button" class="btn btn-md btn-square join-item" on:click={() => copyToClipboard(generatedLink)}>-->
            <!--                        <Fa icon={faClipboard} class="stroke-current"/>-->
            <!--                    </button>-->
            <!--                </Tooltip>-->
            <!--            </div>-->
            <!--            <div class="bg-base-200 line-clamp-2 p-1">{generatedLink}</div>-->
        {/if}
        <div class="modal-action">
            {#if generatedLink == undefined}
                <button class="btn" on:click={close}>Cancel</button>
                <button class="btn btn-outline btn-info" on:click={onCreateLink}>Get Link</button>
            {:else }
                <button class="btn btn-outline" on:click={close}>Done</button>
            {/if}
        </div>
    </div>
</div>