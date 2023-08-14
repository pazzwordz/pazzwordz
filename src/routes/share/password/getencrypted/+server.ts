import {createClient} from "@supabase/supabase-js";
import type {Database} from "$lib/database.types";
import {PUBLIC_SUPABASE_URL} from "$env/static/public";
import {SUPABASE_SERVICE_KEY} from "$env/static/private";
import type {error, RequestEvent} from "@sveltejs/kit";

export async function GET({url}: RequestEvent) {

    const id = url.searchParams.get('id');

    if (!id)
        return new Response("Not Found", {status: 404})

    const supabaseAdminClient = createClient<Database>(
        PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_KEY,
        {auth: {persistSession: false}}
    );

    const sharedPassword = await supabaseAdminClient.from("SharedPasswords").select("encrypted").eq("id", id).single();

    if (!sharedPassword.data)
        return new Response("Not Found", {status: 404})

    await supabaseAdminClient.from("SharedPasswords").delete().eq("id", id);

    return new Response(sharedPassword.data.encrypted);
}