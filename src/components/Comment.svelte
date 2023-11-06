<script lang="ts">
	import type { Comment } from '~/lib/reddit/comment';
	import AuthorName from './AuthorName.svelte';
	import { formatDistanceToNowStrict, formatRFC7231 } from 'date-fns';
	import Prose from './Prose.svelte';

	export let comment: Comment;
	export let collapsed = false;
</script>

<div class="comment" class:sticky={comment.sticky}>
	<button class="gutter" title="Collapse thread" on:click={() => (collapsed = !collapsed)} />
	<div class="content">
		<h2 class="subtitle">
			<span class="author">
				<AuthorName author={comment.author} />
			</span>
			{' • '}
			<span title={formatRFC7231(comment.timestamp)}>
				{formatDistanceToNowStrict(comment.timestamp, { addSuffix: true })}
			</span>
			{' • '}
			<a class="permalink" href={comment.permalink}>
				<span class="score">{comment.score.toLocaleString('en-US')}</span>
				{' vote' + (comment.score === 1 ? '' : 's')}
			</a>
		</h2>
		{#if collapsed}
			<i class="collapsed-placeholder" />
		{:else}
			<Prose>
				{@html comment.content.html}
			</Prose>
		{/if}
	</div>
</div>

<style>
	.comment {
		@apply flex items-stretch mb-1;
		@apply bg-white rounded overflow-hidden;
		@apply border-gray-100 border;
	}

	.comment.sticky {
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

	.subtitle .permalink {
		@apply hover:underline;
	}

	i.collapsed-placeholder {
		@apply block w-12 h-1 mb-1 mt-2 bg-gray-100;
	}
</style>
