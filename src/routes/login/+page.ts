import type {PageLoad} from '../../../.svelte-kit/types/src/routes'
import {redirect} from '@sveltejs/kit'

export const load: PageLoad = async ({parent}) => {

    const {session} = await parent()

    if (session) {
        throw redirect(302, '/')
    }

    return {}
}