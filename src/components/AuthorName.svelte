<script lang="ts">
	import type { Author } from '~/lib/reddit/types';

	export let author: Author;
	export let op = false;
</script>

<a
	href="/u/{author.name}"
	class:text-blue-500={!author.role && op}
	class:text-red-500={author.role === 'admin'}
	class:text-green-700={author.role === 'moderator'}
	title={op ? 'original poster' : undefined}
>
	u/{author.name}

	{#if author.role}
		<span class="role" title={author.role}>[{author.role[0].toUpperCase()}]</span>
	{/if}
</a>

<style>
	a {
		@apply hover:underline;
	}

	.role {
		@apply font-normal;
	}
</style>
