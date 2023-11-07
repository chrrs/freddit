<script lang="ts">
	export let next: string | undefined = undefined;
	export let previous: string | undefined = undefined;
</script>

{#if next || previous}
	<div class="pagination">
		{#if previous}
			<a class="previous" href={previous}>prev</a>
		{/if}
		<div class="spacer" />
		{#if next}
			<a class="next" href={next}>next</a>
		{/if}
	</div>
{/if}

<style>
	.pagination {
		@apply flex mb-2;
		@apply bg-gray-100 rounded overflow-hidden;
	}

	.spacer {
		@apply flex-grow;
	}

	a {
		@apply w-20 px-2 py-1;
		@apply bg-blue-200 text-blue-700;
		@apply text-sm font-semibold text-center uppercase;
	}
</style>
