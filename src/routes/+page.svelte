<script lang="ts">
    export let data;

    let clearText: string;
    let encrypted: string = "";

    function encrypt() {
        encrypted = clearText;
    }
</script>
<div class="p-8">
    <div class="flex gap-2">
        <input bind:value={clearText} class="px-4 py-2 border">
        <button on:click={encrypt} class="bg-neutral-900 p-4 text-white font-medium">Encrypt</button>
    </div>
    <span>{encrypted}</span>
</div>
