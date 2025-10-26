import {
    PRIVATE_SURREALDB_DATABASE,
    PRIVATE_SURREALDB_NAMESPACE,
    PRIVATE_SURREALDB_PASSWORD,
    PRIVATE_SURREALDB_URL,
    PRIVATE_SURREALDB_USERNAME
} from "$env/static/private";
import { Surreal } from "surrealdb";

const config = {
    url: PRIVATE_SURREALDB_URL,
    namespace: PRIVATE_SURREALDB_NAMESPACE,
    database: PRIVATE_SURREALDB_DATABASE,
    username: PRIVATE_SURREALDB_USERNAME,
    password: PRIVATE_SURREALDB_PASSWORD
};

// Define the function to get the database instance
export async function createSurreal() {

    const db = new Surreal();

    try {
        await db.connect(config.url, {
            namespace: config.namespace,
            database: config.database,
            authentication: {
                username: config.username,
                password: config.password
            }
        });

        return {
            db,
            error: null
        };
    } catch (err) {

        if (err instanceof Error) {
            await db.close();

            return {
                db: null,
                error: err
            };
        }

        throw 'Unknown error occurred during database connection';
    }
}