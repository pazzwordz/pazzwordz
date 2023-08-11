import {createClient} from '@supabase/supabase-js'
import {PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY} from '$env/static/public'
import {redirect} from "@sveltejs/kit";
import type {Database} from "$lib/database.types";

export async function load({parent}: any) {
    const {session, supabase} = await parent();
    if (!session)
        throw redirect(302, '/login')

    return {
        supabase: supabase
    }
}