<script lang="ts">
	import { register } from '../login/auth.remote';

	const { username, password } = register.fields;
</script>

<section>
	<h1 class="text-2xl font-bold">Register</h1>

	<form class="mt-10 flex flex-col items-center justify-center space-y-6" {...register}>
		<input class="rounded-lg border p-3" {...username.as('text')} placeholder="Username" />
		<input class="rounded-lg border p-3" {...password.as('password')} placeholder="Password" />
		<button class="rounded-lg border bg-blue-500 p-3 text-white">Register</button>
	</form>
	<hr class="my-5" />
	<p class="text-center text-gray-600">
		<a href="/login" class="text-blue-500 underline">Already registered?</a>
	</p>
	<hr class="my-5" />
</section>
