import {PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL} from '$env/static/public'
import {createSupabaseLoadClient} from '@supabase/auth-helpers-sveltekit'
import {createClient} from "@supabase/supabase-js";
import type {Database} from "$lib/database.types";

/** @type {import('./$types').LayoutLoad} */
export const load = async ({fetch, data, depends}) => {
    depends('supabase:auth')
    const supabase = createSupabaseLoadClient<Database>({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event: {fetch},
        serverSession: data.session,
    })

    const {
        data: {session},
    } = await supabase.auth.getSession()

    return {supabase, session}
}