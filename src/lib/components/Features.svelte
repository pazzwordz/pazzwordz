<script>
    import {routes} from "$lib/config";
    import Fa from "svelte-fa";
    import {faCloud, faComputer, faServer} from "@fortawesome/free-solid-svg-icons";
</script>

<div class="grid lg:grid-cols-3 gap-8 pb-8  my-16">
    <div class="hero bg-base-200 rounded-xl py-4">
        <div class="hero-content text-center">
            <div class="max-w-md">
                <div class="flex flex-col items-center justify-center gap-4 w-full text-primary">
                    <Fa icon="{faComputer}" class="text-5xl"/>
                    <h2 class="text-5xl font-bold uppercase">Local</h2>
                </div>

                <div class="min-h-[15rem] flex items-center">
                    <table class="table table-sm my-8">
                        <tbody>
                        <tr class="flex items-center w-full">
                            <td><input type="checkbox" checked={true} class="checkbox checkbox-primary pointer-events-none"/></td>
                            <td class="font-medium w-[15rem]">Instant Access</td>
                        </tr>
                        <tr class="flex items-center w-full">
                            <td><input type="checkbox" checked={true} class="checkbox checkbox-primary pointer-events-none"/></td>
                            <td class="font-medium w-[15rem]">Unlimited Passwords</td>
                        </tr>
                        <tr class="flex items-center">
                            <td><input type="checkbox" checked={true} class="checkbox checkbox-primary pointer-events-none"/></td>
                            <td class="font-medium w-[15rem]">Backup Control</td>
                        </tr>
                        <tr class="flex items-center">
                            <td><input type="checkbox" checked={true} class="checkbox checkbox-primary pointer-events-none"/></td>
                            <td class="font-medium w-[15rem]">Everything on YOUR Device</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <a class="btn btn-outline btn-primary" href={routes.local}>Get Started Now</a>
            </div>
        </div>
    </div>

    <div class="hero bg-base-200 rounded-xl py-4">
        <div class="hero-content text-center">
            <div class="max-w-md">
                <div class="flex flex-col items-center justify-center gap-4 w-full text-info">
                    <Fa icon="{faCloud}" class="text-5xl"/>
                    <h2 class="text-5xl font-bold uppercase">Cloud</h2>
                </div>
                <div class="min-h-[15rem] flex items-center">
                    <table class="table table-sm my-8">
                        <tbody>
                        <tr class="flex items-center w-full">
                            <td><input type="checkbox" checked={true} class="checkbox checkbox-info pointer-events-none"/></td>
                            <td class="font-medium w-[15rem]">Free Tier Available</td>
                        </tr>
                        <tr class="flex items-center w-full">
                            <td><input type="checkbox" checked={true} class="checkbox checkbox-info pointer-events-none"/></td>
                            <td class="font-medium w-[15rem]">Unlimited Passwords</td>
                        </tr>
                        <tr class="flex items-center">
                            <td><input type="checkbox" checked={true} class="checkbox checkbox-info pointer-events-none"/></td>
                            <td class="font-medium w-[15rem]">Device Management</td>
                        </tr>
                        <tr class="flex items-center">
                            <td><input type="checkbox" checked={true} class="checkbox checkbox-info pointer-events-none"/></td>
                            <td class="font-medium w-[15rem]">Share Passwords</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <a class="btn btn-outline btn-info" href={routes.cloud.cloud}>Create Account</a>
            </div>
        </div>
    </div>
    <div class="hero bg-base-200 rounded-xl py-4">
        <div class="hero-content text-center">
            <div class="max-w-md">
                <div class="flex flex-col items-center justify-center gap-4 w-full">
                    <Fa icon="{faServer}" class="text-5xl"/>
                    <h2 class="text-5xl font-bold uppercase">Self-Hosted</h2>
                </div>
                <div class="min-h-[15rem] flex items-center">
                    <table class="table table-sm my-8">
                        <tbody>
                        <tr class="flex items-center w-full">
                            <td><input type="checkbox" checked={true} class="checkbox pointer-events-none"/></td>
                            <td class="font-medium w-[15rem]">Unrestricted Access</td>
                        </tr>
                        <tr class="flex items-center w-full">
                            <td><input type="checkbox" checked={true} class="checkbox pointer-events-none"/></td>
                            <td class="font-medium w-[15rem]">Easy Setup with Documentation</td>
                        </tr>
                        <tr class="flex items-center">
                            <td><input type="checkbox" checked={true} class="checkbox pointer-events-none"/></td>
                            <td class="font-medium w-[15rem]">100% Privacy</td>
                        </tr>
                        <tr class="flex items-center">
                            <td><input type="checkbox" checked={true} class="checkbox pointer-events-none"/></td>
                            <td class="font-medium w-[15rem]">Open Source</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <a class="btn btn-outline" href={routes.github} target="_blank">View Documentation</a>
            </div>
        </div>
    </div>
</div>