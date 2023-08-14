import {redirect} from "@sveltejs/kit";
import type {PageLoad} from "./$types";
import {routes} from "$lib/config";

export const load: PageLoad = async ({parent}) => {

    const {session, supabase} = await parent();

    if (!session)
        throw redirect(302, routes.auth.login)

    const response = await supabase.from("UserData").select('*')
    let hasPremium = response.data![0].premium;

    return {
        supabase: supabase,
        hasPremium: hasPremium
    }
}