import type {PageLoad} from "./$types";
import type {ProjectStats} from "$lib/types";

export const load: PageLoad = async ({parent}: any) => {
    const {session, supabase} = await parent();

    const response = await supabase.from("ProjectStats").select("*").limit(1).order('createdAt', { ascending: false }).single();

    const stats: ProjectStats = response.data!;

    return {stats}
}