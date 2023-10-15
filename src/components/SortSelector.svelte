<script lang="ts">
	export let current: string;
	export let currentTimeFrame: string;
	export let urlPrefix: string;
</script>

<div class="sort">
	<div class="order">
		<a class:active={current === 'hot'} href="{urlPrefix}/">hot</a>
		<a class:active={current === 'new'} href="{urlPrefix}/new">new</a>
		<a class:active={current === 'rising'} href="{urlPrefix}/rising">rising</a>
		<a class:active={current === 'controversial'} href="{urlPrefix}/controversial">controversial</a>
		<a class:active={current === 'top'} href="{urlPrefix}/top">top</a>
	</div>

	{#if current === 'top'}
		<div class="time-frame">
			<a class:active={currentTimeFrame === 'hour'} title="hour" href="?t=hour">1H</a>
			<a class:active={currentTimeFrame === 'day'} title="day" href="top">24H</a>
			<a class:active={currentTimeFrame === 'week'} title="week" href="?t=week">W</a>
			<a class:active={currentTimeFrame === 'month'} title="month" href="?t=month">M</a>
			<a class:active={currentTimeFrame === 'year'} title="year" href="?t=year">Y</a>
			<a class:active={currentTimeFrame === 'all'} title="all time" href="?t=all">A</a>
		</div>
	{/if}
</div>

<style>
	.sort {
		@apply flex justify-between flex-wrap gap-1 mb-2;
	}

	a {
		@apply px-2 py-1 rounded;
		@apply text-sm font-semibold uppercase;
		@apply text-gray-600 hover:text-black;
	}

	a.active {
		@apply bg-gray-300 text-black;
	}
</style>
