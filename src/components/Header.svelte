<script>
	import { resetAfterSubmit } from '~/lib/util';
</script>

<header>
	<div class="container">
		<a href="/" class="brand">freddit</a>
		<form action="/search" on:submit={resetAfterSubmit}>
			<input name="q" type="text" placeholder="Search..." />
			<button type="submit">
				<div class="i-lucide-search" />
			</button>
		</form>
	</div>
</header>

<style>
	header {
		@apply bg-white py-2;
	}

	header .container {
		@apply flex items-center;
	}

	.brand {
		@apply font-semibold hover:underline;
	}

	form {
		@apply flex-1 ml-4 rounded overflow-hidden;
		@apply flex items-stretch;
	}

	form input {
		@apply flex-1 px-3 py-1;
		@apply bg-gray-100;
	}

	form button {
		@apply px-4;
		@apply bg-gray-100 hover:bg-gray-200;
	}
</style>
