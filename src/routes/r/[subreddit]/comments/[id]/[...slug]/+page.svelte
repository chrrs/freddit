<script lang="ts">
	import Post from '~/components/Post.svelte';

	export let data;
</script>

<svelte:head>
	<title>{data.post.title} - r/{data.post.subreddit} - Freddit</title>
</svelte:head>

<div class="container">
	<Post showSubreddit fullHeight post={data.post} />
</div>

<style>
	.container {
		@apply mt-4;
	}
</style>
