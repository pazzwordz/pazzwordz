<script lang="ts">
    import {routes} from "$lib/navRoutes";

    let date = "11 Aug. 2023";
</script>

<div class="hero min-h-[50vh] bg-base-200 rounded-xl vignette" style="background-image: url(/banner2.webp);">
    <div class="hero-overlay bg-base-300 bg-opacity-80"></div>
    <div class="hero-content text-center max-w-[90vw] flex-col lg:flex-row">
        <div class="flex flex-col justify-center">
            <h1 class="text-3xl lg:text-5xl  font-bold uppercase my-4">Simplicity is Security</h1>
            <h2 class="text-md lg:text-lg font-medium lg:mt-4">Introducing Pazzwordz: an Open-Source Password Manager!</h2>
            <span class="text-sm mt-2">Version 1.0, {date}</span>
        </div>
        <div class="divider divider-vertical lg:divider-horizontal"/>
        <div class="flex flex-col gap-8 max-w-md mb-4 lg:mb-0">
            <a class="btn btn-primary btn-outline w-48" href={routes.local}>Local</a>
            <a class="btn btn-info btn-outline w-48" href={routes.cloud.cloud}>Cloud</a>
        </div>
    </div>
</div>

<style>
    .vignette {
        box-shadow: 0 0 800px rgba(0,0,0,0.9) inset
    }
</style>