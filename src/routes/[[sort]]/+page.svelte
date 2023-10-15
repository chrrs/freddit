<script lang="ts">
	import { page } from '$app/stores';
	import Post from '~/components/Post.svelte';
	import SortSelector from '~/components/SortSelector.svelte';

	export let data;
</script>

<svelte:head>
	<title>Freddit</title>
</svelte:head>

<main class="container">
	<SortSelector current={$page.params.sort ?? 'hot'} urlPrefix="" />
	{#each data.posts as post (post.id)}
		<Post showSubreddit {post} />
	{/each}
</main>

<style>
	.container {
		@apply mt-4;
	}
</style>
