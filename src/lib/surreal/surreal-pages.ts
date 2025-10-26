import { error } from "@sveltejs/kit";
import { createSurrealServer } from "./surreal-server";

type Pages = {
    description: string;
    id: string;
    name: string;
};

export async function getPages() {
    
    const { data: db, error: dbError } = await createSurrealServer();

    if (dbError) {
        error(500, dbError.message);
    }

    const [result] = await db.query('SELECT id.to_string(), name, description FROM pages').collect<[Pages[]]>();

    if (!result) {
        error(404, 'Not found');
    }

    return result;
}

