<script lang="ts">
	import { page } from '$app/stores';
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
	{#if $page.params.comment}
		<div class="single-thread">
			<h1>You're viewing a single thread.</h1>
			Click
			<a href={data.post.commentsUrl}>here</a> to go back to the full post view.
		</div>
	{/if}

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

	.single-thread {
		@apply px-4 py-2 mb-2 rounded;
		@apply bg-blue-200 text-blue-700 leading-snug;
	}

	.single-thread h1 {
		@apply font-semibold;
	}

	.single-thread a {
		@apply underline;
	}
</style>
