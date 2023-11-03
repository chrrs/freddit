<script lang="ts">
	import CommentThread from '~/components/CommentThread.svelte';
	import Post from '~/components/Post.svelte';

	export let data;
</script>

<svelte:head>
	<title>{data.post.title} - r/{data.post.subreddit} - Freddit</title>
</svelte:head>

<div class="container">
	<Post showSubreddit fullHeight post={data.post} />

	<div class="comment-spacer" />

	{#if data.post.replies}
		<CommentThread thread={data.post.replies} />
	{/if}
</div>

<style>
	.container {
		@apply mt-4;
	}

	.comment-spacer {
		@apply h-6;
	}
</style>
