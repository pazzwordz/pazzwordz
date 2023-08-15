import {redirect} from "@sveltejs/kit";
import type {PageLoad} from "./$types";
import {DataLayerCloud} from "$lib/persistent/DataLayer";
import {routes} from "$lib/config";
import {getDeviceByFingerprint, getUserData, getUserMainDevice} from "$lib/scripts/functions";
import {fingerprintStore} from "$lib/stores";

export const load: PageLoad = async ({parent}) => {
    const {session, supabase} = await parent();

    if (!session)
        throw redirect(302, routes.auth.login)

    const userId = session.user.id;
    const userData = await getUserData(supabase, userId)
    const mainDevice = await getUserMainDevice(supabase, userId);
    return {
        session,
        hasPremium: userData.premium,
        mainFingerprint: mainDevice!.fingerprint
    }
}