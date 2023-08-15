import {redirect} from '@sveltejs/kit'
import type {PageLoad} from "../../../../.svelte-kit/types/src/routes/$types";

export const load: PageLoad = async ({parent}: any) => {

    const {session, supabase} = await parent()
    if (session) {
        throw redirect(302, '/')
    }
    return {supabase}
}