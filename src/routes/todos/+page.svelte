<script lang="ts">
	import type { PageProps } from './$types';
	import AddTodo from './add-todo.svelte';
	import { getTodosQuery } from './todos.remote';

	let { data }: PageProps = $props();

	const query = getTodosQuery();
</script>

<section class="mt-5 flex flex-col items-center justify-center">
	<div class=" space-y-6">
		{#if data.userId}
			<h2 class="text-4xl font-bold">Todos</h2>
			{#if query.error}
				<p class="text-red-500">Error loading todos: {query.error.message}</p>
			{:else if query.loading}
				<p>Loading todos...</p>
			{:else if query.current}
				<ul>
					{#each query.current as { completed, name }}
						<li>{name} - {completed}</li>
					{/each}
				</ul>
			{:else}
				<p>No todos found.</p>
			{/if}
			<hr class="my-5" />
			<AddTodo />
		{:else}
			<p class="text-red-500">Please log in to view your todos.</p>
		{/if}
	</div>
</section>
