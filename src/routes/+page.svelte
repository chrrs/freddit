<script lang="ts">
	import Post from '~/components/Post.svelte';

	export let data;
</script>

<main class="container">
	{#each data.posts as post (post.id)}
		<Post showSubreddit {post} />
	{/each}
</main>

<style>
	.container {
		@apply mt-4;
	}
</style>
