<script lang="ts">
	import { login } from './auth.remote';

	const { username, password } = login.fields;
</script>

<section>
	<h1 class="text-2xl font-bold">Login</h1>

	<form class="mt-10 flex flex-col items-center justify-center space-y-6" {...login}>
		<input class="rounded-lg border p-3" {...username.as('text')} placeholder="Username" />
		<input class="rounded-lg border p-3" {...password.as('password')} placeholder="Password" />
		<button class="rounded-lg border bg-blue-500 p-3 text-white">Login</button>
	</form>
	<hr class="my-5" />
	<p class="text-center text-gray-600">
		<a href="/register" class="text-blue-500 underline">New User?</a>
	</p>
	<hr class="my-5" />
</section>
