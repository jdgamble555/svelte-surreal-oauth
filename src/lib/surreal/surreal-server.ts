import { getRequestEvent } from "$app/server";
import type { Cookies } from "@sveltejs/kit";
import { RecordId } from "surrealdb";
import { decodeJwt } from "./jwt";
import {
    surrealConnect,
    surrealLogin,
    surrealRefresh,
    surrealRegister
} from "./surreal-auth";


// 30 minutes
const TOKEN_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 30
} as Parameters<Cookies['set']>[2];

// 7 days
const REFRESH_COOKIE_OPTIONS = {
    ...TOKEN_COOKIE_OPTIONS,
    maxAge: 60 * 60 * 24 * 7
} as Parameters<Cookies['set']>[2];


const SURREAL_TOKEN = 'surreal_token';
const SURREAL_REFRESH = 'surreal_refresh';


export async function createServer() {

    const { cookies } = getRequestEvent();

    const surrealToken = cookies.get(SURREAL_TOKEN);
    const refreshToken = cookies.get(SURREAL_REFRESH);

    const { data: db, error: connectError } = await surrealConnect();

    if (connectError) {
        return {
            data: null,
            error: connectError
        };
    }

    // not logged in

    if (!refreshToken) {

        logout();

        return {
            data: db,
            error: null
        };
    }

    // Token still okay

    if (surrealToken) {

        await db.authenticate(surrealToken);

        return {
            data: db,
            error: null
        };
    }

    // Token expired, try to refresh

    const {
        data: refreshData,
        error: refreshError
    } = await surrealRefresh(db, refreshToken);

    if (refreshError) {

        logout();

        return {
            data: null,
            error: refreshError
        };
    }

    const { access, refresh } = refreshData;

    cookies.set(
        SURREAL_TOKEN,
        access,
        TOKEN_COOKIE_OPTIONS
    );

    if (refresh) {
        cookies.set(
            SURREAL_REFRESH,
            refresh,
            REFRESH_COOKIE_OPTIONS
        );

        await db.authenticate(access);

        return {
            data: db,
            error: null
        };

    }

    // Can't refresh, logout

    logout();

    return {
        data: db,
        error: null
    };
}

export async function login(username: string, password: string) {

    logout();

    const { cookies } = getRequestEvent();

    const { data: db, error: dbError } = await createServer();

    if (dbError) {
        return {
            db: null,
            error: dbError
        };
    }

    const {
        data: loginData,
        error: loginError
    } = await surrealLogin(db, username, password);

    if (loginError) {
        return {
            db: null,
            error: loginError
        };
    }

    const { access, refresh } = loginData;

    if (refresh) {
        cookies.set(
            SURREAL_REFRESH,
            refresh,
            REFRESH_COOKIE_OPTIONS
        );
    }

    cookies.set(
        SURREAL_TOKEN,
        access,
        TOKEN_COOKIE_OPTIONS
    );

    return {
        db,
        error: null
    };
};

export async function register(username: string, password: string) {

    logout();

    const { cookies } = getRequestEvent();

    const { data: db, error: dbError } = await createServer();

    if (dbError) {
        return {
            db: null,
            error: dbError
        };
    }

    const {
        data: registerData,
        error: registerError
    } = await surrealRegister(db, username, password);

    if (registerError) {
        return {
            db: null,
            error: registerError
        };
    }

    const { access, refresh } = registerData;

    if (refresh) {
        cookies.set(
            SURREAL_REFRESH,
            refresh,
             REFRESH_COOKIE_OPTIONS
        );
    }

    cookies.set(
        SURREAL_TOKEN,
        access,
        TOKEN_COOKIE_OPTIONS
    );

    return {
        db,
        error: null
    };
};

export function logout() {

    const { cookies } = getRequestEvent();

    const token = cookies.get(SURREAL_TOKEN);
    const refresh = cookies.get(SURREAL_REFRESH);

    if (token) {
        cookies.delete(SURREAL_TOKEN, TOKEN_COOKIE_OPTIONS);
    }

    if (refresh) {
        cookies.delete(SURREAL_REFRESH, REFRESH_COOKIE_OPTIONS);
    }
};

export function getUser() {

    const { cookies } = getRequestEvent();

    const token = cookies.get(SURREAL_TOKEN);

    if (!token) {
        return null;
    }

    return decodeJwt(token).ID as string;
}


export function getUserRecordId() {

    const user_id = getUser();

    if (!user_id) {
        return null;
    }

    const [table, id] = user_id.split(':');

    return new RecordId(table, id);
}


