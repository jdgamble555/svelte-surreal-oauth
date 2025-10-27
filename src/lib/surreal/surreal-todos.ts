import { error } from "@sveltejs/kit";
import { createSurrealServer, getCurrentUserId } from "./surreal-server";
import { DateTime, RecordId, Table, } from "surrealdb";

type Todos = {
    id: string;
    completed: boolean;
    name: string;
    userId: RecordId;
    createdAt: DateTime;
};

export async function getTodos() {

    const userId = getCurrentUserId();

    if (!userId) {
        error(401, 'Unauthorized');
    }

    const { data: db, error: dbError } = await createSurrealServer();

    if (dbError) {
        error(500, dbError.message);
    }

    const [results] = await db
        .query('SELECT id.to_string(), name, completed, userId.to_string(), createdAt.to_string() FROM todos WHERE userId = $userId ORDER BY createdAt.to_string() DESC', {
            userId: new RecordId('users', userId.split(':')[1])
        }).collect<[Todos[]]>();

    if (!results?.length) {
        error(404, 'Not found');
    }

    return results;
}

export async function addTodo(name: string) {

    const userId = getCurrentUserId();

    if (!userId) {
        error(401, 'Unauthorized');
    }

    const { data: db, error: dbError } = await createSurrealServer();

    if (dbError) {
        error(500, dbError.message);
    }

    try {
        const result = await db.insert<Todos>(new Table('todos'), {
            name,
            completed: false,
            userId: new RecordId('users', userId.split(':')[1]),
            createdAt: new DateTime()
        });

        if (!result) {
            error(500, 'Failed to add todo');
        }

        return result;
    } catch (e) {
        console.error(e);
        error(500, e instanceof Error ? e.message : 'Unknown error');
    }
}

export async function toggleTodo(id: string, completed: boolean) {

    const userId = getCurrentUserId();

    if (!userId) {
        error(401, 'Unauthorized');
    }

    const { data: db, error: dbError } = await createSurrealServer();

    if (dbError) {
        error(500, dbError.message);
    }

    const [result] = await db.query('UPDATE todos SET completed = $completed WHERE id = $id AND userId = $userId', {
        id,
        completed,
        userId
    }).collect<[Todos[]]>();

    if (!result) {
        error(500, 'Failed to toggle todo');
    }

    return result;
}

export async function deleteTodo(id: string) {

    const userId = getCurrentUserId();

    if (!userId) {
        error(401, 'Unauthorized');
    }

    const { data: db, error: dbError } = await createSurrealServer();

    if (dbError) {
        error(500, dbError.message);
    }

    const [result] = await db.query('DELETE FROM todos WHERE id = $id AND userId = $userId', {
        id, userId
    }).collect<[Todos[]]>();

    if (!result) {
        error(500, 'Failed to delete todo');
    }

    return result;
}