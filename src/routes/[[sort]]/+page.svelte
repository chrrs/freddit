<script lang="ts">
	import { page } from '$app/stores';
	import Pagination from '~/components/Pagination.svelte';
	import Post from '~/components/Post.svelte';
	import SortSelector from '~/components/SortSelector.svelte';

	export let data;
</script>

<svelte:head>
	<title>Freddit</title>
</svelte:head>

<main class="container">
	<SortSelector
		current={$page.params.sort ?? 'hot'}
		currentTimeFrame={$page.url.searchParams.get('t') ?? 'day'}
		urlPrefix=""
	/>

	{#each data.posts as post (post.id)}
		<Post showSubreddit {post} />
	{/each}

	<Pagination next={data.pagelinks.next} previous={data.pagelinks.previous} />
</main>

<style>
	.container {
		@apply mt-4;
	}
</style>
