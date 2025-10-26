<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<section class="mt-5 flex flex-col items-center justify-center">
	<div class=" space-y-6">
		<h2 class="text-4xl font-bold">Pages</h2>
		{#await data.pages}
			<p>Loading pages...</p>
		{:then pages}
			{#each pages as page}
				<article>
					<h3>{page.name} (ID: {page.id})</h3>
					<p>{page.description}</p>
				</article>
			{/each}
		{:catch error}
			<p class="text-red-500">Error loading pages: {error.message}</p>
		{/await}
	</div>
</section>
