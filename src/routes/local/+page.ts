import {redirect} from "@sveltejs/kit";
import type {PageLoad} from "./$types";
import {DataLayerCloud} from "$lib/persistent/DataLayer";
import {routes} from "$lib/config";

export const load: PageLoad = async ({parent}) => {
    const {session, supabase} = await parent();

    let hasPremium = false;
    if (session) {
        const response = await supabase.from("UserData").select('*')
        hasPremium = response.data![0].premium;
    }

    return {
        hasPremium: hasPremium
    }
}