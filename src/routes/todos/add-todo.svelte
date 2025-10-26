<script lang="ts">
	import { RecordId } from 'surrealdb';
	import { addTodoForm, getTodosQuery } from './todos.remote';
</script>

<form
	{...addTodoForm.enhance(async ({ form, data, submit }) => {
		try {
			await submit().updates(
				getTodosQuery().withOverride((todos) => [
					{
						name: data.name,
						completed: false,
						id: 'temp-id',
						userId: new RecordId('users', 'temp-user')
					},
                    ...todos
				])
			);
			form.reset();
		} catch (error) {
			console.error('Error adding todo:', error);
		}
	})}
	class="flex flex-col items-center justify-center space-y-4"
>
	<input
		class="rounded-lg border p-3"
		{...addTodoForm.fields.name.as('text')}
		placeholder="Todo Name"
	/>
	<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
		Add Todo
	</button>
</form>
