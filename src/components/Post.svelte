<script lang="ts">
	import type { Post } from '~/lib/reddit/types';
	import { formatRFC7231, formatDistanceToNowStrict } from 'date-fns';
	import AuthorName from './AuthorName.svelte';

	export let showSubreddit = false;
	export let post: Post;
</script>

<div class="post" class:nsfw={post.nsfw} class:sticky={post.sticky}>
	<div class="sidebar">{post.score.toLocaleString('en-US')}</div>
	<div class="content">
		<h2 class="subtitle">
			{#if post.nsfw}
				<span class="nsfw">NSFW</span>
			{/if}
			{#if showSubreddit}
				<a class="subreddit" href={`/r/${post.subreddit}`}>
					r/{post.subreddit}
				</a>
			{/if}
			<span title={formatRFC7231(post.timestamp)}>
				{formatDistanceToNowStrict(post.timestamp, { addSuffix: true })}
			</span>
			{' • '}
			<!-- FIXME: Add author name component -->
			<a href={`/u/${post.author.name}`}><AuthorName author={post.author} /></a>
			{' • '}
			<a href={post.post_url}>{post.comments.toLocaleString('en-US')} comments</a>
			{' • '}
			<span>{post.domain}</span>
		</h2>
		<a class="title" href={post.post_url}>
			{#if post.flair}
				<span class="flair">{post.flair}</span>
			{/if}
			<span class="main-title">{post.title}</span>
		</a>
		{#if post.data_url.type === 'url'}
			<p class="link">
				<a href={post.data_url.url}>{post.data_url.url}</a>
			</p>
		{/if}
	</div>
</div>

<style>
	.post {
		@apply flex items-stretch mb-2;
		@apply bg-white rounded overflow-hidden;
		@apply border-gray-100 border;
	}

	.post.nsfw {
		@apply border-red-300;
	}

	.post.sticky {
		@apply border-green-500;
	}

	.sidebar {
		@apply flex-none bg-gray-100 pt-2 w-16;
		@apply text-gray-500 text-sm font-semibold text-center;
	}

	.content {
		@apply px-2 py-1 min-w-0;
	}

	.subtitle {
		@apply text-xs text-gray-500;
	}

	.subtitle .nsfw {
		@apply font-bold text-red-600;
	}

	.subtitle a {
		@apply hover:underline;
	}

	.subtitle .subreddit {
		@apply font-bold;
	}

	.post.sticky .title {
		@apply text-green-700;
	}

	.flair {
		@apply inline-block px-1 bg-gray-100;
		@apply text-sm text-gray-800;
	}

	.main-title {
		@apply font-semibold;
	}

	.link {
		@apply mt-1 text-xs;
		@apply whitespace-nowrap text-ellipsis overflow-hidden;
	}

	.link a {
		@apply text-blue-800 hover:underline;
	}
</style>
