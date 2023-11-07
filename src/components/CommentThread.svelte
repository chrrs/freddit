<script lang="ts">
	import { default as CommentComponent } from './Comment.svelte';
	import type { Comment, Thread } from '~/lib/reddit/comment';

	export let parent: Comment | undefined = undefined;
	export let thread: Thread;

	let collapsed = false;
</script>

<div class="thread">
	{#if parent}
		<CommentComponent comment={parent} bind:collapsed />
	{/if}

	{#if !collapsed}
		<div class="replies" class:inset={parent !== undefined}>
			{#each thread.children as child (child.id)}
				<svelte:self parent={child} thread={child.replies} />

				{#if parent === undefined}
					<div class="spacer" />
				{/if}
			{/each}

			{#if thread.continuationLength}
				<button disabled class="continuation">
					{thread.continuationLength} hidden replies...
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.replies.inset {
		@apply ml-1;
		@apply border-l-[0.25em] border-gray-300;
		@apply pl-6;
	}

	.spacer {
		@apply h-3;
	}

	.continuation {
		@apply opacity-50;

		@apply block text-center w-full py-0.5 mb-1;
		@apply bg-blue-200 rounded;
		@apply text-blue-700 text-sm font-semibold uppercase;
	}
</style>
