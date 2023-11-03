import { error } from '@sveltejs/kit';
import { cacheHeaders } from '~/lib/cache.js';
import { fetchSubreddit } from '~/lib/reddit/scrape.js';
import { validateSort } from '~/lib/util';

export async function load({ setHeaders, params, url }) {
	setHeaders(cacheHeaders);

	if (!validateSort(params.sort)) {
		throw error(404, 'Not Found');
	}

	const subreddit = await fetchSubreddit(params.subreddit, {
		sort: params.sort,
		timeFrame: url.searchParams.get('t') ?? undefined,
	});

	if (subreddit === undefined) {
		throw error(404, 'Not Found');
	}

	return subreddit;
}
