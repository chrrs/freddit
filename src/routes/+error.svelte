<script lang="ts">
	import { page } from '$app/stores';
	import ErrorMessage from '~/components/ErrorMessage.svelte';
</script>

<main class="container">
	<ErrorMessage title="Error {$page.status}" description={$page.error?.message ?? ''} />
</main>

<style>
	.container {
		@apply mt-4;
	}
</style>
