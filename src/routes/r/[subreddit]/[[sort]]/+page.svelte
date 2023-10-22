<script lang="ts">
	import { page } from '$app/stores';
	import ErrorMessage from '~/components/ErrorMessage.svelte';
	import Post from '~/components/Post.svelte';
	import SortSelector from '~/components/SortSelector.svelte';

	export let data;

	$: timeFrame = $page.url.searchParams.get('t') ?? 'day';
	$: showSubreddit = ['popular', 'all'].includes(data.name.toLowerCase()) || data.multi;
</script>

<svelte:head>
	<title>r/{data.name} - Freddit</title>
</svelte:head>

<main class="container">
	{#if data.banned}
		<ErrorMessage title="r/{data.name} has been banned" description={data.reason} />
	{:else if data.private}
		<ErrorMessage title="r/{data.name} is private" description={data.reason} />
	{:else if data.nsfw}
		<ErrorMessage
			title="r/{data.name} is marked NSFW"
			description="Over-18 content is disabled on this instance."
		/>
	{:else}
		<h1 class="title">r/{data.name}</h1>
		<h2 class="subtitle">
			<b>{data.subscribers.toLocaleString('en-US')}</b> members -
			<b>{data.online.toLocaleString('en-US')}</b> online
		</h2>

		<SortSelector
			current={$page.params.sort ?? 'hot'}
			currentTimeFrame={timeFrame}
			urlPrefix="/r/{$page.params.subreddit}"
		/>
		{#each data.posts as post (post.id)}
			<Post {showSubreddit} {post} />
		{/each}
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
