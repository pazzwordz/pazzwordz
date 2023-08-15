import {toast} from "@zerodevx/svelte-toast";
import {successToastTheme} from "$lib/config";
import type {SupabaseClient} from "@supabase/supabase-js";
import type {Database} from "$lib/database.types";
import {dev} from "$app/environment";

export function copyToClipboard (str: string)  {
    toast.push("Copied to clipboard", {theme: successToastTheme})
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    const selected =
        document.getSelection()!.rangeCount > 0
            ? document.getSelection()!.getRangeAt(0)
            : false;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (selected) {
        document.getSelection()!.removeAllRanges();
        document.getSelection()!.addRange(selected);
    }
};

export function isValidHttpUrl(value: string) {
    let url;

    try {
        url = new URL(value);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

export async function getDeviceByFingerprint(supabase: SupabaseClient<Database>, userId: string, fingerprint: string) {
    const response = await supabase.from("DeviceEntry").select("*").eq("userId", userId)
        .eq("fingerprint", fingerprint).single();
    return response.data;
}

export async function getUserMainDevice(supabase: SupabaseClient<Database>, userId: string) {
    const userDataRes = await supabase.from("UserData")
        .select("mainDeviceId").eq("userId", userId).single();
    const deviceId = userDataRes.data!.mainDeviceId;
    if(!deviceId)
        return undefined;
    const deviceRes = await supabase.from("DeviceEntry")
        .select("*").eq("id", deviceId).single()
    return deviceRes.data!;
}

export async function getUserData(supabase: SupabaseClient<Database>, userId: string) {
    const userDataRes = await supabase.from("UserData")
        .select("*").eq("userId", userId).single();
    return userDataRes.data!;
}