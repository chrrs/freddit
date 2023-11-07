<script lang="ts">
	import { page } from '$app/stores';
	import ErrorMessage from '~/components/ErrorMessage.svelte';
	import Pagination from '~/components/Pagination.svelte';
	import Post from '~/components/Post.svelte';
	import SortSelector from '~/components/SortSelector.svelte';

	export let data;

	// FIXME: Better support for multireddits.
	// FIXME: Don't show subscriber counts / online counts on all / popular / multi.

	$: name = data.info?.name ?? $page.params.subreddit;
	$: showSubredditOnPosts =
		['popular', 'all'].includes(name) || $page.params.subreddit.includes('+');
</script>

<svelte:head>
	<title>r/{name} - Freddit</title>
</svelte:head>

<main class="container">
	{#if data.type === 'banned'}
		<ErrorMessage title="r/{name} has been banned" description={data.reason} />
	{:else if data.type === 'private'}
		<ErrorMessage title="r/{name} is private" description={data.reason} />
	{:else if data.type === 'nsfw-blocked'}
		<ErrorMessage
			title="r/{name} is marked NSFW"
			description="Over-18 content is disabled on this instance."
		/>
	{:else}
		<h1 class="title">r/{name}</h1>
		<h2 class="subtitle">
			<b>{data.info.subscribers.toLocaleString('en-US')}</b> members -
			<b>{data.info.online.toLocaleString('en-US')}</b> online
		</h2>

		<SortSelector
			current={$page.params.sort ?? 'hot'}
			currentTimeFrame={$page.url.searchParams.get('t') ?? 'day'}
			urlPrefix="/r/{$page.params.subreddit}"
		/>

		{#each data.posts as post (post.id)}
			<Post showSubreddit={showSubredditOnPosts} {post} />
		{/each}

		<Pagination next={data.pagelinks.next} previous={data.pagelinks.previous} />
	{/if}
</main>

<style>
	.container {
		@apply mt-4;
	}

	.title {
		@apply font-bold text-xl;
	}

	.subtitle {
		@apply mb-4;
		@apply text-sm;
	}

	.subtitle b {
		@apply font-semibold;
	}
</style>
