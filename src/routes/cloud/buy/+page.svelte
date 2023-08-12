<script>
    import {faCircleCheck} from "@fortawesome/free-regular-svg-icons";
    import Fa from "svelte-fa";
    import {routes} from "$lib/navRoutes";
</script>

<section class="pb-8">
    <a class="btn w-64 btn-outline flex gap-2 items-center" href={routes.cloud.cloud}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="stroke-current"
             viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                  d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5zM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5z"/>
        </svg>
        <span>Back</span>
    </a>
    <div class="hero bg-base-200 rounded-xl mt-8">
        <div class="hero-content flex-col w-full py-8">
            <div class="text-center lg:text-left">
                <h1 class="text-5xl font-bold mb-4">Choose your Plan!</h1>
            </div>
            <div class="flex flex-col lg:flex-row gap-8 w-full items-center justify-center">
                <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl ">
                    <div class="card-body">
                        <h2 class="card-title">CloudPazz | Monthly</h2>
                        <div class="flex flex-col my-8 gap-4 text-md font-medium">
                            <div class="flex items-center gap-2 text-secondary">
                                <Fa icon={faCircleCheck}/>
                                <span>All Cloud Features</span>
                            </div>
                            <div class="flex items-center gap-2 text-secondary">
                                <Fa icon={faCircleCheck}/>
                                <span>Unlimited Devices</span>
                            </div>
                            <div class="flex items-center gap-2 text-secondary">
                                <Fa icon={faCircleCheck}/>
                                <span>Password Sharing</span>
                            </div>
                            <div class="flex items-center gap-2 text-base-200">
                                <Fa icon={faCircleCheck}/>
                                <span>_</span>
                            </div>
                        </div>
                        <div class="flex font-medium">
                            <b class="text-5xl">$0.95</b>
                            <div class="flex flex-col text-gray-500">
                                <span>per</span>
                                <span>month</span>
                            </div>
                        </div>
                        <div class="form-control mt-6">
                            <button class="btn btn-primary">Start Free Trail</button>
                        </div>
                    </div>
                </div>
                <div class="indicator w-full max-w-sm">
                    <span class="indicator-item  indicator-center badge badge-secondary">Most Popular</span>
                    <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <div class="card-body">
                            <h2 class="card-title">CloudPazz | Yearly</h2>
                            <div class="flex flex-col my-8 gap-4 text-md font-medium">
                                <div class="flex items-center gap-2 text-secondary">
                                    <Fa icon={faCircleCheck}/>
                                    <span>All Features</span>
                                </div>
                                <div class="flex items-center gap-2 text-secondary">
                                    <Fa icon={faCircleCheck}/>
                                    <span>Unlimited Devices</span>
                                </div>
                                <div class="flex items-center gap-2 text-secondary">
                                    <Fa icon={faCircleCheck}/>
                                    <span>Password Sharing</span>
                                </div>
                                <div class="flex items-center gap-2 text-secondary">
                                    <Fa icon={faCircleCheck}/>
                                    <span>Save 15%</span>
                                </div>
                            </div>
                            <div class="flex font-medium">
                                <b class="text-5xl">$9.69</b>
                                <div class="flex flex-col text-gray-500">
                                    <span>per</span>
                                    <span>year</span>
                                </div>
                            </div>
                            <div class="form-control mt-6">
                                <button class="btn btn-primary">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</section>