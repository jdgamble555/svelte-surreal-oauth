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
import { decodeJwt } from "./jwt";


const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 30 // 30 minutes
} as Parameters<Cookies['set']>[2];

const SURREAL_TOKEN = 'surreal_token';
const SURREAL_REFRESH = 'surreal_refresh';

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

        const surrealToken = cookies.get(SURREAL_TOKEN);

        /*
        if (decodeJwt(surrealToken || '').exp as number * 1000 < Date.now()) {
            const surrealRefresh = cookies.get(SURREAL_REFRESH);    
            if (surrealRefresh) {
                const {
                    data: refreshData,
                    error: refreshError
                } = await tryCatch(db.refresh(surrealRefresh));
                if (refreshError) {
                    throw refreshError;
                }
                const { access, refresh } = refreshData;

                if (refresh) {
                    cookies.set(SURREAL_REFRESH, refresh, COOKIE_OPTIONS);
                }

                if (access) {
                    cookies.set(SURREAL_TOKEN, access, COOKIE_OPTIONS);
                }
            }
        }
        */
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

    if (signInError) {
        console.error('Sign-in error:', signInError);
        return {
            db: null,
            error: signInError
        };
    }

    const { access, refresh } = signInData;

    if (refresh) {
        cookies.set(
            SURREAL_REFRESH,
            refresh,
            COOKIE_OPTIONS
        );
    }

    cookies.set(
        SURREAL_TOKEN,
        access,
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

    const { access, refresh } = signInData;

    if (refresh) {
        cookies.set(
            SURREAL_REFRESH,
            refresh,
            COOKIE_OPTIONS
        );
    }

    cookies.set(
        SURREAL_TOKEN,
        access,
        COOKIE_OPTIONS
    );

    return {
        db,
        error: null
    };
};


export async function surrealLogout() {

    const { cookies } = getRequestEvent();

    cookies.delete(SURREAL_TOKEN, COOKIE_OPTIONS);
};


export function getCurrentUserId() {

    const { cookies } = getRequestEvent();

    const token = cookies.get(SURREAL_TOKEN);

    if (!token) {
        return null;
    }

    const user_id = decodeJwt(token).ID as string;

    return new RecordId('users', user_id.split(':')[1]);
}