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

	<!-- FIXME: Temporary spacing -->
	<div class="comment-spacer" />
	<div class="comment-spacer" />

	<!-- FIXME: Support continuations -->
	{#each data.comments as comment (comment.id)}
		<CommentThread parent={comment} op={data.post.author.name} />
		<div class="comment-spacer" />
	{/each}
</div>

<style>
	.container {
		@apply mt-4;
	}

	.comment-spacer {
		@apply h-3;
	}
</style>
