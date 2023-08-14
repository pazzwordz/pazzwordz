export const successToastTheme = {
    "--toastColor": "mintcream",
    "--toastBackground": "rgba(72,187,120,0.9)",
    "--toastBarBackground": "#2F855A",
}

export const errorToastTheme = {
    "--toastColor": "white",
    "--toastBackground": "#FF0000",
    "--toastBarBackground": "#505050",
}

export const routes = {
    pricing: "/#pricing",
    local: "/local",
    cloud: {
        cloud: "/cloud",
        buy: "/cloud/buy",
        cloudVault: "/cloud/vault",
        cloudDevices: "/cloud/devices",
    },
    auth: {
        login: "/auth/login",
        signUp: "/auth/signup",
        resetPassword: "/auth/reset-password"
    },
    legal: {
        terms: "/legal/terms",
        privacy: "/legal/privacy",
        cookies: "/legal/cookies",
        imprint: "/legal/imprint"
    },
    generator: "/password-generator",
    github: "https://github.com/pazzwordz/pazzwordz"
} as const;
