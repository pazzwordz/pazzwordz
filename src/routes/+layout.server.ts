import {createClient} from "@supabase/supabase-js";
import {PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL} from "$env/static/public";

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals: { getSession } }) => {
    return {
        session: await getSession(),
    }
}