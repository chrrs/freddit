<script lang="ts">
	// This is a bit hacky, but it works.
	import Page from '~/routes/r/[subreddit]/comments/[id]/[[slug]]/[[comment]]/+page.svelte';
	export let data;
</script>

<Page {data} />
