import { getUser } from '$lib/surreal/surreal-server';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async () => {

    const userId = getUser();

    return {
        userId
    };
};
