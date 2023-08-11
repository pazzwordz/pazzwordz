<script lang="ts">

    import {routes} from "$lib/navRoutes";


    let username = "ShitUser"
</script>

<div>
    <b class="text-4xl">Welcome {username}</b>

    <div class="flex gap-8 my-8">
        <div class="card w-96 bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">Your Pazzwordz</h2>
                <p>Manage your Passwords in one secure place. Start Here!</p>
                <div class="card-actions justify-end">
                    <a class="btn btn-primary" href={routes.cloudVault}>Pazzwordz</a>
                </div>
            </div>
        </div>

        <div class="card w-96 bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">Devices</h2>
                <p>See which devices accessed your account and manage them!</p>
                <div class="card-actions justify-end">
                    <a class="btn btn-info" href={routes.cloudDevices}>Manage</a>
                </div>
            </div>
        </div>
    </div>
</div>