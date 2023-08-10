import {createClient} from "@supabase/supabase-js";
import {PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL} from "$env/static/public";

// src/routes/+layout.server.ts
export const load = async ({ locals: { getSession } }: any) => {
    return {
        session: await getSession(),
    }
}