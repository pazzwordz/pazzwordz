import {redirect} from "@sveltejs/kit";
import type {PageLoad} from "./$types";
import {DataLayerCloud} from "$lib/persistent/DataLayer";

// export async function load({parent}): PageLoad {
//     const {session, supabase} = await parent();
//     if (!session)
//         throw redirect(302, '/login')
//
//     return {
//         supabase: supabase
//     }
// }

export const load: PageLoad = async ({parent}) => {
    const {session, supabase} = await parent();

    return {
        session
    }
}