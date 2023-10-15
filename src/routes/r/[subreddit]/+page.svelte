<script lang="ts">
	import ErrorMessage from '~/components/ErrorMessage.svelte';
	import Post from '~/components/Post.svelte';

	export let data;

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
	{:else}
		<h1 class="title">r/{data.name}</h1>
		<h2 class="subtitle">
			<b>{data.subscribers.toLocaleString('en-US')}</b> members -
			<b>{data.online.toLocaleString('en-US')}</b> online
		</h2>

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
