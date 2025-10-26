<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<main class="mt-5 flex flex-col items-center justify-center">
	<div class=" space-y-6">
		<h2 class="text-4xl font-bold">Pages</h2>

		{#each data.result as page}
			<article>
				<h3>{page.name} (ID: {page.id})</h3>
				<p>{page.description}</p>
			</article>
		{/each}
	</div>
</main>
