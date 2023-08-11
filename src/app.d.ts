// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type {Database} from "$lib/database.types";

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            supabase: SupabaseClient<Database>

            getSession(): Promise<Session | null>
        }

        interface PageData {
            session: Session | null
        }

        // interface Platform {}
    }
}

export {};
