<script lang="ts">
	import '@unocss/reset/tailwind-compat.css';
	import 'nprogress/nprogress.css';

	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';
	import Header from '~/components/Header.svelte';

	NProgress.configure({
		minimum: 0.16,
	});

	$: if ($navigating) {
		NProgress.start();
	} else {
		NProgress.done();
	}
</script>

<Header />

<slot />

<style>
	:global(html) {
		@apply bg-gray-200;
	}

	:global(.container) {
		@apply mx-auto max-w-2xl px-2;
	}
</style>
