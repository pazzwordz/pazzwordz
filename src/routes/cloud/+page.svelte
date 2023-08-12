<script lang="ts">
    import type {PageData} from "./$types";

    import {routes} from "$lib/navRoutes";

    export let data: PageData;

    let username = data.session!.user.email;

</script>
<svelte:head>
    <title>Pazzwordz | Cloud</title>
</svelte:head>
<div>
    <b class="text-4xl">Welcome {username}</b>

    <div class="card w-80 lg:w-96 bg-base-100 shadow-xl my-8">
        <div class="card-body">
            <h2 class="card-title">Your Plan: {data.hasPremium ? "CloudPazz" : "Free"}</h2>
            <p>Manage your Plan in your Stripe Dashboard here!</p>
            <div class="card-actions justify-end">
                <a class="btn btn-outline" href="#">Change</a>
            </div>
        </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-4">
        <div class="card w-80 lg:w-96 bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">Your Pazzwordz</h2>
                <p>Manage your Passwords in one secure place. Start Here!</p>
                <div class="card-actions justify-end">
                    <a class="btn btn-primary" href={routes.cloud.cloudVault}>Pazzwordz</a>
                </div>
            </div>
        </div>

        <div class="card w-80 lg:w-96 bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">Devices</h2>
                <p>See which devices accessed your account and manage them!</p>
                <div class="card-actions justify-end">
                    <a class="btn btn-info" href={routes.cloud.cloudDevices}>Manage</a>
                </div>
            </div>
        </div>
    </div>
</div>