import { form, query } from "$app/server";
import { addTodo, deleteTodo, getTodos, toggleTodo } from "$lib/surreal/surreal-todos";
import * as v from 'valibot';

export const getTodosQuery = query(async () => {
    return await getTodos();
});


export const addTodoForm = form(
    v.object({
        name: v.string()
    }),
    async ({ name }) => {
        await addTodo(name);
    }
);

export const deleteTodoForm = form(
    v.object({
        id: v.string()
    }),
    async ({ id }) => {
        await deleteTodo(id);
    }
);

export const toggleTodoForm = form(
    v.object({
        id: v.string(),
        completed: v.boolean()
    }),
    async ({ id, completed }) => {
        await toggleTodo(id, completed);
    }
);