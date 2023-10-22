<!-- FIXME: Workaround for https://github.com/sveltejs/kit/issues/10836 -->

<script lang="ts">
	import Page from './[sort]/+page.svelte';
	export let data;
</script>

<Page {data} />
