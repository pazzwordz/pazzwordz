import {redirect} from "@sveltejs/kit";
import type {PageLoad} from "./$types";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import {PUBLIC_SUPABASE_URL} from "$env/static/public";
import {SECRET_SUPABASE_KEY} from "$env/static/private";
import type {Database} from "$lib/database.types";
import type {ProjectStats, ProjectStatsEntry} from "$lib/types";
//
// async function getRepoStars(): Promise<number> {
//     const result = await fetch("https://api.github.com/repos/pazzwordz/pazzwordz")
//     const data = await result.json()
//     return data["stargazers_count"];
// }
//
// async function getTotalUsers(client: SupabaseClient<Database>) {
//     const result = await client.from("UserData").select("userId", {count: "exact"})
//     return result.count;
// }
//
// async function getTotalPasswordsManaged(client: SupabaseClient<Database>) {
//     const result = await client.from("PasswordEntry").select("id", {count: "exact"})
//     return result.count;
// }

export const load: PageLoad = async ({parent}: any) => {
    const supabaseAdmin: SupabaseClient<Database> = createClient<Database>(
        PUBLIC_SUPABASE_URL,
        SECRET_SUPABASE_KEY
    )

    const response = await supabaseAdmin.from("ProjectStats")
        .select("*").limit(1).single();
    const stats: ProjectStats = response.data!;
    return {stats}
}