import { error } from '@sveltejs/kit';
import { cacheHeaders } from '~/lib/cache';
import { fetchHome } from '~/lib/reddit/scrape.js';
import { validateSort } from '~/lib/util';

export async function load({ setHeaders, params, url }) {
	setHeaders(cacheHeaders);

	if (!validateSort(params.sort)) {
		throw error(404, 'Not Found');
	}

	return {
		posts: await fetchHome({
			sort: params.sort,
			timeFrame: url.searchParams.get('t') ?? undefined,
		}),
	};
}
