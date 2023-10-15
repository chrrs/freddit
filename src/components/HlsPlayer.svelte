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

<!-- svelte-ignore a11y-media-has-caption -->
<video controls bind:this={el} />

<style>
	video {
		@apply w-full aspect-video;
	}
</style>
