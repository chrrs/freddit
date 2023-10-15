<script lang="ts">
	import Post from '~/components/Post.svelte';

	export let data;

	$: showSubreddit = ['popular', 'all'].includes(data.name.toLowerCase()) || data.multi;
</script>

<svelte:head>
	<title>r/{data.name} - Freddit</title>
</svelte:head>

<main class="container">
	{#each data.posts as post (post.id)}
		<Post {showSubreddit} {post} />
	{/each}
</main>

<style>
	.container {
		@apply mt-4;
	}
</style>
