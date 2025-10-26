import { error } from '@sveltejs/kit';
import { createSurreal } from '$lib/surreal';
import type { PageServerLoad } from './$types';

type About = {
    description: string;
    id: string;
    name: string;
};


export const load: PageServerLoad = async () => {

    const { db, error: dbError } = await createSurreal();

    if (dbError || !db) {
        console.error('Database connection error:', dbError);
        throw error(500, dbError.message);
    }

    const results = await db.query('SELECT * FROM pages').collect<[About[]]>();

    if (!results) {
        throw error(404, 'Not found');
    }

    const pages = results[0].map((row) => ({
        ...row,
        id: row.id?.toString?.() ?? String(row.id)
    }));

    return {
        result: pages
    };
};

