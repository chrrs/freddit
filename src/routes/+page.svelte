<script lang="ts">
	import Post from '~/components/Post.svelte';

	export let data;
</script>

<div class="wrapper">
	{#each data.posts as post (post.id)}
		<Post showSubreddit {post} />
	{/each}
</div>

<style>
	:global(html) {
		@apply bg-gray-200;
	}

	.wrapper {
		@apply mx-auto max-w-3xl px-2;
	}
</style>
