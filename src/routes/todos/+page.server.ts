import { getCurrentUserId } from '$lib/surreal/surreal-server';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async () => {

    const userId = getCurrentUserId();

    return {
        userId: userId?.id.toString() || null
    };
};
