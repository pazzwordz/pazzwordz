<script>
    import Hero from "$lib/components/Hero.svelte";
    import Stats from "$lib/components/Stats.svelte";
    import {routes} from "$lib/navRoutes";

    export let data

    const handleSignOut = async () => {
        await data.supabase.auth.signOut()
    }

    // import kyber from 'crystals-kyber';

    // // To generate a public and private key pair (pk, sk)
    // let pk_sk = kyber.KeyGen768();
    // let pk = pk_sk[0];
    // let sk = pk_sk[1];
    //
    // // To generate a random 256-bit symmetric key (ss) and its encapsulation (c)
    // let c_ss = kyber.Encrypt768(pk);
    // let c = c_ss[0];
    // let ss1 = c_ss[1];
    //
    // // To decapsulate and obtain the same symmetric key
    // let ss2 = kyber.Decrypt768(c, sk);

</script>

<Hero/>

<Stats/>

<div class="grid lg:grid-cols-3 gap-8 pb-8">
    <div class="hero bg-base-200 rounded-xl">
        <div class="hero-content text-center">
            <div class="max-w-md">
                <h1 class="text-5xl font-bold uppercase text-primary">Local</h1>
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

    <div class="hero h-[50vh] bg-base-200 rounded-xl">
        <div class="hero-content text-center">
            <div class="max-w-md">
                <h1 class="text-5xl font-bold  uppercase text-info">Cloud</h1>
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
                <a class="btn btn-outline btn-info" href={routes.cloud}>Create Account</a>
            </div>
        </div>
    </div>
    <div class="hero h-[50vh] bg-base-200 rounded-xl">
        <div class="hero-content text-center">
            <div class="max-w-md">
                <h1 class="text-5xl font-bold uppercase">Self-Hosted</h1>
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