import { form } from "$app/server";
import { surrealLogin, surrealLogout, surrealRegister } from "$lib/surreal/surreal-server";
import { redirect } from "@sveltejs/kit";
import { error } from "console";
import * as v from 'valibot';


const authSchema = v.object({
    username: v.string(),
    password: v.string()
});

export const login = form(
    authSchema,
    async ({ username, password }) => {
    
        const { error: loginError } = await surrealLogin(username, password);

        if (loginError) {
            error(401, loginError.message);
        }

        redirect(303, '/');
    }
);

export const register = form(
    authSchema,
    async ({ username, password }) => {
    
        const { error: loginError } = await surrealRegister(username, password);

        if (loginError) {
            error(401, loginError.message);
        }

        redirect(303, '/');
    }
);

export const logout = form('unchecked', async () => {
    
    await surrealLogout();

    redirect(303, '/');    
});