import {redirect} from "@sveltejs/kit";
import type {PageLoad} from "./$types";

export const load: PageLoad = async ({parent}) => {

    const {session, supabase} = await parent();

    const {data: entry} = await supabase.from("UserData").select('*')

    return {
        supabase: supabase,
        hasPremium: entry![0].premium
    }
}