import { getPagesStream } from '$lib/surreal/surreal-pages';
import { error } from 'console';
import type { PageServerLoad } from './$types';
import { createServer } from '$lib/surreal/surreal-server';


export const load: PageServerLoad = async () => {

    const { data: db, error: dbError } = await createServer();

    if (dbError) {
        error(500, dbError.message);
    }

    if (!db) {
        throw error(500, 'Database connection failed');
    }

    return {
        pages: getPagesStream(db)
    };
};

