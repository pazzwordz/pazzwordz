import {redirect} from "@sveltejs/kit";
import type {PageLoad} from "./$types";
import {routes} from "$lib/navRoutes";

export const load: PageLoad = async ({parent}) => {

    const {session, supabase} = await parent();

    if (!session)
        throw redirect(302, routes.auth.login)

    return {
        supabase: supabase
    }
}