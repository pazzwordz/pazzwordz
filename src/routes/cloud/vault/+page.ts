import {redirect} from "@sveltejs/kit";
import type {PageLoad} from "./$types";
import {DataLayerCloud} from "$lib/persistent/DataLayer";
import {routes} from "$lib/navRoutes";

export const load: PageLoad = async ({parent}) => {
    const {session, supabase} = await parent();

    console.log(await parent())

    if (!session)
        throw redirect(302, routes.auth.login)

    const response = await supabase.from("UserData").select('*')
    let hasPremium = response.data![0].premium;

    return {
        session,
        hasPremium: hasPremium
    }
}