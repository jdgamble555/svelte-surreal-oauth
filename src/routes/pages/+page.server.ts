import { getPages } from '$lib/surreal/surreal-pages';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async () => {

    return {
        pages: getPages()
    };
};

