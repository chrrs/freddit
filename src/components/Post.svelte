<script lang="ts">
	import type { Post } from '~/lib/reddit/types';
	import { formatRFC7231, formatDistanceToNowStrict } from 'date-fns';
	import AuthorName from './AuthorName.svelte';
	import HlsPlayer from './HlsPlayer.svelte';
	import Prose from './Prose.svelte';

	export let showSubreddit = false;
	export let fullHeight = false;
	export let post: Post;

	let loadEmbed = false;
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

		<!-- FIXME: Decide if we want 'card' style media or something smaller.. -->
		<!-- FIXME: Blur NSFW media? -->
		{#if post.data_url.type === 'url'}
			<div class="content-spacer" />
			<p class="link">
				<a href={post.data_url.url}>{post.data_url.url}</a>
			</p>
		{:else if post.data_url.type === 'self' && post.data_url.content}
			<hr class="self-separator" />
			<!-- Sanitization done server side. -->
			<Prose>{@html post.data_url.content}</Prose>
		{:else if post.data_url.type === 'image'}
			<div class="content-spacer" />
			<img class="media" class:aspect-16-9={!fullHeight} src={post.data_url.url} alt={post.title} />
		{:else if post.data_url.type === 'video'}
			<div class="content-spacer" />
			<HlsPlayer {fullHeight} src={post.data_url.url} />
		{:else if post.data_url.type === 'embed'}
			<div class="content-spacer" />
			{#if loadEmbed}
				<iframe
					class="media"
					class:aspect-16-9={!fullHeight}
					allow="fullscreen;"
					src={post.data_url.embed_url}
					title={post.title}
				/>
			{:else}
				<div class="embed-warning">
					{#if post.data_url.thumbnail}
						<img src={post.data_url.thumbnail} alt="embed thumbnail" />
					{/if}
					<button on:click={() => (loadEmbed = true)}>Load Embed</button>
					<a href={post.data_url.original_url}>{post.data_url.original_url}</a>
				</div>
			{/if}
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
		@apply flex-1 px-2 py-1 min-w-0;
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

	.content-spacer {
		@apply h-1;
	}

	.link {
		@apply text-xs;
		@apply whitespace-nowrap text-ellipsis overflow-hidden;
	}

	.link a {
		@apply text-blue-800 hover:underline;
	}

	hr.self-separator {
		@apply mb-2 mt-3 border-gray-300;
	}

	.media {
		@apply w-full max-h-2xl;
		@apply object-contain object-center;
	}

	.aspect-16-9 {
		@apply aspect-video;
	}

	.embed-warning {
		@apply relative overflow-hidden;
		@apply w-full aspect-video bg-black;
		@apply flex flex-col items-center justify-center;
	}

	.embed-warning img {
		@apply absolute top-0 left-0 w-full h-full;
		@apply object-cover object-center;
		filter: brightness(50%) blur(4px);
	}

	.embed-warning button {
		@apply z-1 border px-2 py-1 text-white bg-black mb-2;
	}

	.embed-warning a {
		@apply z-1 text-xs text-white hover:underline;
	}
</style>
