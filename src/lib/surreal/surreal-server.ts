import { getRequestEvent } from "$app/server";
import {
    PRIVATE_SURREALDB_DATABASE,
    PRIVATE_SURREALDB_NAMESPACE,
    PRIVATE_SURREALDB_PASSWORD,
    PRIVATE_SURREALDB_URL,
    PRIVATE_SURREALDB_USERNAME
} from "$env/static/private";
import { tryCatch } from "$lib/try-catch";
import type { Cookies } from "@sveltejs/kit";
import { RecordId, Surreal } from "surrealdb";


const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 30 // 30 minutes
} as Parameters<Cookies['set']>[2];

const SURREAL_COOKIE_NAME = 'surrealdb_token';

const config = {
    url: PRIVATE_SURREALDB_URL,
    namespace: PRIVATE_SURREALDB_NAMESPACE,
    database: PRIVATE_SURREALDB_DATABASE,
    username: PRIVATE_SURREALDB_USERNAME,
    password: PRIVATE_SURREALDB_PASSWORD
};

export async function createSurrealServer() {

    const { cookies } = getRequestEvent();

    const db = new Surreal();

    return await tryCatch((async () => {

        await db.connect(config.url, {
            namespace: config.namespace,
            database: config.database
        });

        const surrealToken = cookies.get(SURREAL_COOKIE_NAME);

        if (surrealToken) {
            await db.authenticate(surrealToken);
        }

        return db;
    })());
}

export async function surrealLogin(username: string, password: string) {

    // TODO - case where cookie exists

    const { cookies } = getRequestEvent();

    const { data: db, error: dbError } = await createSurrealServer();

    if (dbError) {
        console.log(dbError);
        return {
            db: null,
            error: dbError
        };
    }

    const {
        error: signInError,
        data: signInData
    } = await tryCatch(db.signin({
        namespace: config.namespace,
        database: config.database,
        variables: {
            username,
            password
        },
        access: 'user'
    }));

    console.log(db);

    if (signInError) {
        console.error('Sign-in error:', signInError);
        return {
            db: null,
            error: signInError
        };
    }

    const { token } = signInData;

    cookies.set(
        SURREAL_COOKIE_NAME,
        token,
        COOKIE_OPTIONS
    );

    return {
        db,
        error: null
    };
};

export async function surrealRegister(username: string, password: string) {

    const { cookies } = getRequestEvent();

    const { data: db, error: dbError } = await createSurrealServer();

    if (dbError) {
        return {
            db: null,
            error: dbError
        };
    }

    const {
        error: signInError,
        data: signInData
    } = await tryCatch(db.signup({
        namespace: config.namespace,
        database: config.database,
        variables: {
            username,
            password
        },
        access: 'user'
    }));

    if (signInError) {
        return {
            db: null,
            error: signInError
        };
    }

    const { token } = signInData;

    cookies.set(
        SURREAL_COOKIE_NAME,
        token,
        COOKIE_OPTIONS
    );

    return {
        db,
        error: null
    };
};


export async function surrealLogout() {

    const { cookies } = getRequestEvent();

    cookies.delete(SURREAL_COOKIE_NAME, COOKIE_OPTIONS);
};


export function getCurrentUserId() {

    const { cookies } = getRequestEvent();

    const token = cookies.get(SURREAL_COOKIE_NAME);

    if (!token) {
        return null;
    }

    const user_id = JSON.parse(atob(token.split('.')[1])).ID as string;

    return new RecordId('users', user_id.split(':')[1]);
}