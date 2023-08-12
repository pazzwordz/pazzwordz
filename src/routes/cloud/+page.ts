import {redirect} from "@sveltejs/kit";
import type {PageLoad} from "./$types";

export const load: PageLoad = async ({parent}) => {

    const {session, supabase} = await parent();

    let hasPremium = false;
    if(session != undefined) {
        const response = await supabase.from("UserData").select('*')
        if(response.data)
            hasPremium = response.data[0].premium
    }
    return {
        supabase: supabase,
        hasPremium: hasPremium
    }
}