<script lang="ts">
	export let title: string | undefined = undefined;
	export let description: string;
</script>

<div>
	{#if title}
		<h1>{title}</h1>
	{/if}
	<p>{description}</p>
</div>

<style>
	div {
		@apply px-4 py-2 rounded;
		@apply bg-red-200 text-red-700 leading-snug;
	}

	h1 {
		@apply font-semibold;
	}
</style>
