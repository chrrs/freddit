<script lang="ts">
	import type { Comment } from '~/lib/reddit/types';
	import AuthorName from './AuthorName.svelte';
	import Prose from './Prose.svelte';
	import { formatDistanceToNowStrict, formatRFC7231 } from 'date-fns';

	export let parent: Comment;
	let collapsed = false;
</script>

<div class="thread">
	<div class="parent" class:sticky={parent.sticky}>
		<button class="gutter" title="Collapse thread" on:click={() => (collapsed = !collapsed)} />
		<div class="content">
			<h2 class="subtitle">
				<span class="author"><AuthorName author={parent.author} /></span>
				{' • '}
				<span title={formatRFC7231(parent.timestamp)}>
					{formatDistanceToNowStrict(parent.timestamp, { addSuffix: true })}
				</span>
				{' • '}
				<span class="score">{parent.score.toLocaleString('en-US')}</span>
				{' vote' + (parent.score === 1 ? '' : 's')}
			</h2>
			{#if collapsed}
				<i class="collapsed-placeholder" />
			{:else}
				<Prose>
					{@html parent.content}
				</Prose>
			{/if}
		</div>
	</div>

	<!-- FIXME: Support continuations -->
	{#if !collapsed}
		<div class="replies">
			{#each parent.replies as child (`${parent.id}_${child.id}`)}
				<svelte:self parent={child} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.parent {
		@apply flex items-stretch mb-1;
		@apply bg-white rounded overflow-hidden;
		@apply border-gray-100 border;
	}

	.parent.sticky {
		@apply border-green-500;
	}

	.gutter {
		@apply flex-none w-4 bg-gray-100 float-left;
	}

	.content {
		@apply flex-grow;
		@apply px-2 py-1;
	}

	.subtitle {
		@apply text-xs text-gray-500;
	}

	.subtitle .author {
		@apply font-bold;
	}

	.subtitle .score {
		@apply font-semibold;
	}

	i.collapsed-placeholder {
		@apply block w-12 h-1 mb-1 mt-2 bg-gray-100;
	}

	.replies {
		@apply ml-1;
		@apply border-l-[0.25em] border-gray-300;
		@apply pl-6;
	}
</style>
