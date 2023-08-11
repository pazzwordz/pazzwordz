<script>
    import {routes} from "$lib/navRoutes";
</script>

<footer class="footer p-10 bg-base-200 text-base-content px-[5vw] lg:px-[10vw]">
    <div>
        <span class="footer-title">Pazzwordz</span>
        <a class="link link-hover" href={routes.local}>Local</a>
        <a class="link link-hover" href={routes.cloud.cloud}>Cloud</a>
        <a class="link link-hover" href={routes.pricing}>Pricing</a>
    </div>
    <div>
        <span class="footer-title">Legal</span>
        <a class="link link-hover" href={routes.legal.terms}>Terms of use</a>
        <a class="link link-hover" href={routes.legal.privacy}>Privacy policy</a>
        <a class="link link-hover" href={routes.legal.cookies}>Cookie policy</a>
        <a class="link link-hover" href={routes.legal.imprint}>Imprint</a>
    </div>
    <div>
        <span class="footer-title">Stay up to Date!</span>
        <div class="form-control w-80">
            <div class="relative">
                <input type="text" placeholder="your@email.com" class="input input-bordered w-full pr-16"/>
                <button class="btn btn-primary absolute top-0 right-0 rounded-l-none">Subscribe</button>
            </div>
        </div>
    </div>
</footer>