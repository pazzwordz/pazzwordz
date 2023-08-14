import {SUPABASE_SERVICE_KEY} from "$env/static/private";
import {createClient} from "@supabase/supabase-js";
import type {Database} from "$lib/database.types";
import {PUBLIC_SUPABASE_URL} from "$env/static/public";
import {error} from "@sveltejs/kit";

export const load = async ({url}: any) => {

    const supabaseAdminClient = createClient<Database>(
        PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_KEY,
        {auth: {persistSession: false}}
    );

    const id = url.searchParams.get('id');
    const key = url.searchParams.get('key');
    const sharedPassword = await supabaseAdminClient.from("SharedPasswords").select("encrypted").eq("id", id).single();

    if (!sharedPassword.data)
        throw error(500, "Not Found!")

    const encryptedPass = sharedPassword.data!.encrypted;

    return {
        encrypted: encryptedPass,
        key: key
    }
}