import {redirect} from "@sveltejs/kit";
import type {PageLoad} from "./$types";
import {SECRET_SUPABASE_KEY} from '$env/static/private';

export const load: PageLoad = async ({parent}: any) => {
    const {session} = await parent()

    return {}
}