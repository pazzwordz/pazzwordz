<script lang="ts">
    import {copyToClipboard} from "$lib/functions";
    import {faCopy} from "@fortawesome/free-solid-svg-icons";
    import Tooltip from "$lib/components/Tooltip.svelte";
    import Fa from "svelte-fa";
    import {decryptHex, deriveKey, encryptText} from "$lib/crypto";

    export let data;
    let pazz = "";

    function stringify(bytes: Uint8Array | null): string {
        if (bytes == null)
            return JSON.stringify(null);
        const serializedArray = Array.from(bytes);
        return JSON.stringify(serializedArray);
    };

    function parse(text: string): Uint8Array | null {
        const obj = JSON.parse(text);
        if (obj == null)
            return null;
        return new Uint8Array(obj);
    };

    function decryptPassword() {
        let test = deriveKey("testKey", "asd");
        let encryptedPass = encryptText("SecretePass", test)

        // let b64 = btoa(stringify(test));
        // console.log(b64)
        //
        // let j = parse(atob(b64));
        // console.log(j)

        pazz = decryptHex(encryptedPass, parse(atob(data.key)));
    }

</script>

<h2 class="text-5xl font-bold text-center mt-8 mb-20 w-full">A Password was Shared with you</h2>

<div class="flex flex-col gap-6 w-full h-full">
    <div class="flex flex-col items-center gap-2">
        <div class="bg-base-100 text-md lg:text-5xl rounded-xl flex items-center gap-4 lg:py-8 pl-4 lg:pl-8 lg:pr-4">
            <span>{pazz}</span>
            <Tooltip text="Copy" class="relative">
                <button class="btn btn-ghost"
                        on:click={() => copyToClipboard(pazz)}>
                    <Fa icon={faCopy} class="text-3xl"/>
                </button>
            </Tooltip>
        </div>
    </div>
    <button class="btn btn-success btn-lg" on:click={decryptPassword}>Decrypt</button>
</div>
