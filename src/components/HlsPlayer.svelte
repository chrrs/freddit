<script lang="ts">
	import Hls from 'hls.js';
	import { onMount } from 'svelte';

	export let src: string;

	let el: HTMLVideoElement;
	let hls: Hls;

	$: hls?.loadSource(src);

	onMount(() => {
		if (Hls.isSupported()) {
			hls = new Hls();
			hls.loadSource(src);
			hls.attachMedia(el);
		}
	});
</script>

<noscript><div class="warning">HLS Playback requires JS to be enabled.</div></noscript>

<!-- svelte-ignore a11y-media-has-caption -->
<video controls bind:this={el} />

<style>
	video {
		@apply w-full aspect-video;
	}

	.warning {
		@apply px-3 py-1 rounded;
		@apply bg-red-200 text-red-700;
	}
</style>
