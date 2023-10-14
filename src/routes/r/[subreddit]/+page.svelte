<script lang="ts">
	import Post from '~/components/Post.svelte';

	export let data;

	$: showSubreddit = ['popular', 'all'].includes(data.name.toLowerCase()) || data.multi;
</script>

<div class="wrapper">
	<h1>r/{data.name}</h1>
	{#each data.posts as post (post.id)}
		<Post {showSubreddit} {post} />
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
