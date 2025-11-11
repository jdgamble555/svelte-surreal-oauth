import { form } from "$app/server";
import { login, logout, register } from "$lib/surreal/surreal-server";
import { error, redirect } from "@sveltejs/kit";
import * as v from 'valibot';


const authSchema = v.object({
    username: v.string(),
    password: v.string()
});

export const loginForm = form(
    authSchema,
    async ({ username, password }) => {
    
        const { error: loginError } = await login(username, password);

        if (loginError) {
            error(401, loginError.message);
        }

        redirect(303, '/');
    }
);

export const registerForm = form(
    authSchema,
    async ({ username, password }) => {
    
        const { error: loginError } = await register(username, password);

        if (loginError) {
            error(401, loginError.message);
        }

        redirect(303, '/');
    }
);

export const logoutForm = form('unchecked', () => {
    
    logout();

    redirect(303, '/');    
});