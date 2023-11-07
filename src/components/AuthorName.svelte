<script lang="ts">
	import type { Author } from '~/lib/reddit/author';

	export let author: Author | undefined;
</script>

{#if author}
	<a
		href="/u/{author.name}"
		class:text-blue-500={!author.distinguished && author.originalPoster}
		class:text-red-700={author.distinguished === 'admin emeritus'}
		class:text-red-500={author.distinguished === 'admin'}
		class:text-green-700={author.distinguished === 'moderator'}
		title={author.originalPoster ? 'original poster' : undefined}
	>
		u/{author.name}

		{#if author.distinguished}
			<span class="role" title={author.distinguished}>
				[{author.distinguished[0].toUpperCase()}]
			</span>
		{/if}
	</a>

	{#if author.flair}
		<span class="flair">{author.flair}</span>
	{/if}
{:else}
	<span>u/[deleted]</span>
{/if}

<style>
	a {
		@apply hover:underline;
	}

	.role {
		@apply font-normal;
	}

	.flair {
		@apply font-normal;
		@apply px-1 border-1 border-gray-200;
	}
</style>
