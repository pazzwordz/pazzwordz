export const routes = {
    pricing: "/#pricing",
    local: "/local",
    cloud: {
        cloud: "/cloud",
        cloudVault: "/cloud/vault",
        cloudDevices: "/cloud/devices",
    },
    auth: {
        login: "/login",
        signUp: "/signup",
        resetPassword: "/reset-password"
    },
    legal: {
        terms: "/legal/terms",
        privacy: "/legal/privacy",
        cookies: "/legal/cookies",
        imprint: "/legal/imprint"
    },
    github: "https://github.com/pazzwordz/pazzwordz"
} as const;
