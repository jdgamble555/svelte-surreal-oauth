import { error } from "@sveltejs/kit";
import type { Surreal } from "surrealdb";

type Pages = {
    description: string;
    id: string;
    name: string;
};

export async function getPagesStream(db: Surreal) {

    const [result] = await db
        .query(
            `
            SELECT
                id.to_string(),
                name,
                description
            FROM pages
            `
        )
        .collect<[Pages[]]>();

    if (!result) {
        error(404, 'Not found');
    }

    return result;
}

