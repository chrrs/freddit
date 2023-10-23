<script lang="ts">
	import type { Author } from '~/lib/reddit/types';

	export let author: Author;
</script>

<a
	href="/u/{author.name}"
	class:text-red-500={author.role === 'admin'}
	class:text-green-700={author.role === 'moderator'}
	title={author.role}
>
	u/{author.name}

	{#if author.role}
		<span class="role">[{author.role[0].toUpperCase()}]</span>
	{/if}
</a>

<style>
	.role {
		@apply font-semibold;
	}
</style>
