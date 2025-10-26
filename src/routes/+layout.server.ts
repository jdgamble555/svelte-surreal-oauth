import { getCurrentUserId } from '$lib/surreal/surreal-server';
import type { LayoutServerLoad } from './$types';


export const load: LayoutServerLoad = async () => {

    const userId = getCurrentUserId();

    return {
        userId
    };
};