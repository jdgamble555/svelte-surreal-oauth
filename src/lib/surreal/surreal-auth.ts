import { Surreal } from "surrealdb";
import {
    PRIVATE_SURREALDB_DATABASE,
    PRIVATE_SURREALDB_NAMESPACE,
    PRIVATE_SURREALDB_PASSWORD,
    PRIVATE_SURREALDB_URL,
    PRIVATE_SURREALDB_USERNAME
} from "$env/static/private";

const config = {
    url: PRIVATE_SURREALDB_URL,
    namespace: PRIVATE_SURREALDB_NAMESPACE,
    database: PRIVATE_SURREALDB_DATABASE,
    username: PRIVATE_SURREALDB_USERNAME,
    password: PRIVATE_SURREALDB_PASSWORD
};

export async function surrealConnect() {

    const db = new Surreal();

    try {
        await db.connect(config.url, {
            namespace: config.namespace,
            database: config.database
        });
    } catch (e) {
        if (e instanceof Error) {
            return {
                data: null,
                error: e
            };
        }
        return {
            data: null,
            error: new Error('Unknown error during SurrealDB connection')
        };
    }
    return {
        data: db,
        error: null
    };
}

export async function surrealRefresh(db: Surreal, refreshToken: string) {

    try {
        const refreshData = await db.signin({
            namespace: config.namespace,
            database: config.database,
            access: 'user',
            variables: { refresh: refreshToken }
        });
        return {
            data: refreshData,
            error: null
        };
    } catch (e) {
        if (e instanceof Error) {
            return {
                data: null,
                error: e
            };
        }
        return {
            data: null,
            error: new Error('Unknown error during token refresh')
        };
    }
}

export async function surrealLogin(
    db: Surreal, 
    username: string,
     password: string
    ) {

    try {
        const signinData = await db.signin({
            namespace: config.namespace,
            database: config.database,
            variables: {
                username,
                password
            },
            access: 'user'
        });
        return {
            data: signinData,
            error: null
        };
    } catch (e) {
        if (e instanceof Error) {
            return {
                data: null,
                error: e
            };
        }
        return {
            data: null,
            error: new Error('Unknown error during login')
        };
    }
};

export async function surrealRegister(
    db: Surreal,
    username: string,
    password: string
) {

    try {
        const signupData = await db.signup({
            namespace: config.namespace,
            database: config.database,
            variables: {
                username,
                password
            },
            access: 'user'
        });
        return {
            data: signupData,
            error: null
        };
    } catch (e) {
        if (e instanceof Error) {
            return {
                data: null,
                error: e
            };
        }
        return {
            data: null,
            error: new Error('Unknown error during registration')
        };
    }
};
