<script>
    import Fa from "svelte-fa";
    import {faCircleCheck, faCircleXmark} from "@fortawesome/free-regular-svg-icons";

    let features = ["AES-256 ", "PBKDF2 with SHA512", "Zero-Knowledge Encryption", "Open Source", "Unlimited Passwords", "Autofill Plugin", "Cloud Storage", "Unlimited Devices", "Password Sharing"]

    let availableFeatures = 4;
</script>

<div class="grid lg:grid-cols-5 gap-8 pb-8">
    <div class="lg:col-span-3">
        <h2 class="text-5xl font-bold text-center lg:text-start">Our Pricing Plans</h2>
        <p class="py-6 font-medium leading-loose text-justify">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
        </p>
        <div class="grid-cols-2 gap-4 hidden lg:grid font-medium">
            {#each features as feature, i}
                {#if i <= availableFeatures}
                    <div class="flex items-center gap-2 text-secondary">
                        <Fa icon={faCircleCheck}/>
                        <span>{feature}</span>
                    </div>
                {:else }
                    <div class="flex items-center gap-2 text-base-100">
                        <Fa icon={faCircleXmark}/>
                        <span>{feature}</span>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
    <div class="lg:col-span-2 flex flex-col gap-4">
        <div class="w-full bg-base-200 rounded-xl border-l-4 border-primary/20 hover:border-primary p-6 flex justify-between cursor-pointer" on:click={() => {availableFeatures = 4}}>
            <div class="w-3/5">
                <h4 class="text-2xl font-bold mb-2 text-white">Local</h4>
                <p class="">
                    All basic features, data securely stored on your device.
                </p>
            </div>
            <div class="w-2/5 flex items-center justify-center">
                <h4 class="text-4xl font-bold mb-2 text-white">Free</h4>
            </div>
        </div>
        <div class="w-full bg-base-200 rounded-xl border-l-4 border-info/20 hover:border-info p-6 flex justify-between cursor-pointer" on:click={() => {availableFeatures = 6}}>
            <div class="w-3/5">
                <h4 class="text-2xl font-bold mb-2 text-white">Cloud</h4>
                <p class="">
                    All cloud features, unlimited Passwords but limited to one device.
                </p>
            </div>
            <div class="w-2/5 flex items-center justify-center">
                <h4 class="text-4xl font-bold mb-2 text-white">Free</h4>
            </div>
        </div>
        <div class="w-full bg-base-200 rounded-xl border-l-4 border-secondary/20 hover:border-secondary p-6 flex justify-between cursor-pointer" on:click={() => {availableFeatures = 8}}>
            <div class="w-3/5">
                <h4 class="text-2xl font-bold mb-2 text-white">CloudPazz</h4>
                <p class="">
                    All features, unlimited Passwords and unlimited devices.
                </p>
            </div>
            <div class="w-2/5 flex flex-col lg:flex-row items-center justify-center">
                <h4 class="text-4xl font-bold mb-2 text-white">$ 0.95</h4>
                <span class="mx-1">/ Month</span>
            </div>
        </div>
    </div>
</div>