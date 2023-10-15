<script lang="ts">
	export let current: string;
	export let urlPrefix: string;
</script>

<div class="sort">
	<a class:active={current === 'hot'} href="{urlPrefix}/">hot</a>
	<a class:active={current === 'new'} href="{urlPrefix}/new">new</a>
	<a class:active={current === 'rising'} href="{urlPrefix}/rising">rising</a>
	<a class:active={current === 'controversial'} href="{urlPrefix}/controversial">controversial</a>
	<a class:active={current === 'top'} href="{urlPrefix}/top">top</a>
</div>

<style>
	.sort {
		@apply mb-2;
	}

	a {
		@apply px-2 py-1 rounded;
		@apply text-sm font-semibold uppercase;
		@apply text-gray-600 hover:text-black;
	}

	a.active {
		@apply bg-gray-300 text-black;
	}
</style>
