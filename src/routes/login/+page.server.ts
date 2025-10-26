import { getCurrentUserId } from '$lib/surreal/surreal-server';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async () => {

    const userId = getCurrentUserId();

    if (userId) {
        redirect(303, '/');
    }
};