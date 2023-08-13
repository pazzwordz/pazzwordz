<script lang="ts">
    import {fade} from 'svelte/transition';
    import {onMount} from "svelte";

    let cookiesAccepted: boolean | undefined = false;

    function setCookie(name: string, value: string, days: number) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name: string) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function acceptCookies() {
        setCookie('cookieConsent', "true", 365);
        gtag('consent', 'update', {
            'ad_storage': 'granted',
            'analytics_storage': 'granted'
        });
        cookiesAccepted = true;
    }

    function declineCookies() {
        setCookie('cookieConsent', "false", 1);
        cookiesAccepted = false;
    }

    onMount(() => {
        if (getCookie('cookieConsent') !== null) {
            cookiesAccepted = getCookie('cookieConsent') === "true"
        } else {
            cookiesAccepted = undefined;
        }
    })

</script>

{#if cookiesAccepted === undefined}
    <div class="fixed bottom-8 w-[50vw] z-30 flex justify-center" transition:fade={{ delay: 100, duration: 200 }}>
        <div class="alert bg-base-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>We use cookies to improve our service!</span>
            <div>
                <button class="btn btn-sm btn-ghost text-base-200" on:click={declineCookies}>Deny</button>
                <button class="btn btn-sm btn-primary" on:click={acceptCookies}>Accept</button>
            </div>
        </div>
    </div>
{/if}