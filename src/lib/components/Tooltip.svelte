<script lang="ts">
    import {onMount} from "svelte";

    let clazz = '';
    export {clazz as class};
    export let text: string;
    let cssShit: string = "delay-yes"

    let timeout: any;
    let slotElement;

    function onEnter() {
        cssShit = "delay-yes"
        // startTimeout()
    }


    function onLeave() {
        // stopTimeout();
        cssShit = "delay-no"
    }

    function onMove() {
        //stopTimeout();
    }

    // function startTimeout() {
    //     if(!timeout) {
    //         timeout = setTimeout(() => {
    //             console.log("stood still 200")
    //             cssShit = "delay-yes"
    //         }, 500)
    //     }
    // }
    //
    // function stopTimeout() {
    //     if(timeout) {
    //         clearTimeout(timeout);
    //         timeout = undefined;
    //     }
    // }

</script>
<div class="inline-block {clazz}">
    <div class="group relative" on:mouseenter={onEnter} on:mouseleave={onLeave} on:mousemove={onMove}>
        <slot/>
        <!--ToDo: alex, please center this properly, thanks-->
        <span class={`pointer-events-none absolute -top-7 left-[50%] translate-x-[-50%] w-max rounded
     bg-[hsl(var(--nf))] px-2 py-1 text-xs font-medium delay-200 hover:delay-500 opacity-0
     shadow group-hover:opacity-100 transition-opacity ${cssShit}`}>
        {text}
     </span>
    </div>
</div>


<style>
    .delay-yes {
        transition-delay: 400ms;
    }

    .delay-no {
        transition-delay: 0ms;
    }
</style>
