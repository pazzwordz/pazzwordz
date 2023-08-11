import {redirect} from "@sveltejs/kit";

export async function load({parent}: any) {
    const {session, supabase} = await parent();
    if (!session)
        throw redirect(302, '/login')

    return {
        supabase: supabase
    }
}