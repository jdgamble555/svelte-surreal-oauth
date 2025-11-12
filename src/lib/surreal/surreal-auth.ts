import { Surreal } from "surrealdb";
import {
    PRIVATE_SURREALDB_DATABASE,
    PRIVATE_SURREALDB_NAMESPACE,
    PRIVATE_SURREALDB_PASSWORD,
    PRIVATE_SURREALDB_URL,
    PRIVATE_SURREALDB_USERNAME
} from "$env/static/private";
import { getRequestEvent } from "$app/server";


const config = {
    url: PRIVATE_SURREALDB_URL,
    namespace: PRIVATE_SURREALDB_NAMESPACE,
    database: PRIVATE_SURREALDB_DATABASE,
    username: PRIVATE_SURREALDB_USERNAME,
    password: PRIVATE_SURREALDB_PASSWORD
};

export async function surrealConnect() {

    const { fetch } = getRequestEvent();

    const db = new Surreal({ fetchImpl: fetch });

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

export async function _surrealRefresh(
    db: Surreal,
    refreshToken: string
) {

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

export async function surrealRefresh(
    _db: Surreal,
    refreshToken: string
) {

    const res = await fetch(`${config.url}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            NS: config.namespace,
            DB: config.database,
            AC: 'user',
            refresh: refreshToken
        })
    });

    if (!res.ok) {
        return {
            error: new Error(`Refresh failed: ${res.statusText}`),
            data: null
        };
    }

    const { token, refresh } = await res.json();

    return {
        data: { access: token, refresh } as { access: string; refresh?: string },
        error: null
    };
}

export async function surrealLogin(
    _db: Surreal,
    username: string,
    password: string
) {

    const res = await fetch(`${config.url}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            NS: config.namespace,
            DB: config.database,
            AC: 'user',
            username,
            password
        })
    });

    if (!res.ok) {
        return {
            error: new Error(`Signin failed: ${res.statusText}`),
            data: null
        };
    }

    const { token, refresh } = await res.json();

    return {
        data: { access: token, refresh } as { access: string; refresh?: string },
        error: null
    };
}

export async function _surrealLogin(
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

        console.log('Signin data:', signinData);

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

export async function _surrealRegister(
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

export async function surrealRegister(
    _db: Surreal,
    username: string,
    password: string
) {

    const res = await fetch(`${config.url}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            NS: config.namespace,
            DB: config.database,
            AC: 'user',
            username,
            password
        })
    });

    if (!res.ok) {
        return {
            error: new Error(`Signup failed: ${res.statusText}`),
            data: null
        };
    }

    const { token, refresh } = await res.json();

    return {
        data: { access: token, refresh },
        error: null
    };
}
