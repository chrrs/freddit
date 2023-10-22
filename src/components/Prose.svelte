<article>
	<slot />
</article>

<style>
	/* FIXME: This is all very crude */
	article :global(h1) {
		@apply text-2xl font-semibold mt-2;
	}

	article :global(h2) {
		@apply text-xl font-semibold mt-1;
	}

	article :global(h3) {
		@apply text-lg font-semibold mt-1;
	}

	article :global(h4),
	article :global(h5) {
		@apply font-semibold mt-1;
	}

	article :global(p) {
		@apply my-2;
	}

	article :global(b),
	article :global(strong) {
		@apply font-semibold;
	}

	article :global(code:not(pre > code)) {
		@apply font-mono px-1;
		@apply border-1 border-gray-200;
	}

	article :global(pre) {
		@apply font-mono px-2 py-1 my-2;
		@apply border-1 border-gray-200;
	}

	article :global(blockquote) {
		@apply border-l-4 border-gray-200;
		@apply text-gray-800;
		@apply ml-2 pl-4 py-0.5;
	}

	article :global(a) {
		@apply text-blue-800 hover:underline;
	}

	article :global(table) {
		@apply block my-4 overflow-x-auto max-w-fit;
		@apply border-1 border-gray-100;
	}

	article :global(table thead) {
		@apply bg-gray-200;
	}

	article :global(table thead tr th) {
		@apply uppercase px-4 py-1;
		@apply font-semibold text-sm text-gray-900;
	}

	article :global(table tbody tr td) {
		@apply px-4 py-1;
	}

	article :global(table tbody tr:nth-child(even)) {
		@apply bg-gray-100;
	}

	article :global(ol) {
		@apply list-decimal list-outside;
	}

	article :global(ul) {
		@apply list-circle list-outside;
	}

	article :global(li) {
		@apply ml-8;
	}

	article :global(hr) {
		@apply my-2;
	}
</style>
