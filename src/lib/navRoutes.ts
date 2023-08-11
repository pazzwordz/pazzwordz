export const routes = {
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
    github: "https://github.com/BlackPhoenix134/pazzwordz"
} as const;
