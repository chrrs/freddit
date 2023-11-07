import { error } from '@sveltejs/kit';
import { cacheHeaders } from '~/lib/cache';
import { fetchHome } from '~/lib/reddit/scrape.js';
import { validateSort } from '~/lib/util';

export async function load({ setHeaders, params, url }) {
	setHeaders(cacheHeaders);

	if (!validateSort(params.sort)) {
		throw error(404, 'Not Found');
	}

	return await fetchHome({
		sort: {
			sort: params.sort,
			timeFrame: url.searchParams.get('t') ?? undefined,
		},
		count: url.searchParams.get('count') ?? undefined,
		before: url.searchParams.get('before') ?? undefined,
		after: url.searchParams.get('after') ?? undefined,
	});
}
