import { error } from '@sveltejs/kit';
import { cacheHeaders } from '~/lib/cache';
import { getHomePage } from '~/lib/reddit/home';
import { validateSort } from '~/lib/reddit/util';

export async function load({ setHeaders, params, url }) {
	setHeaders(cacheHeaders);

	if (!validateSort(params.sort)) {
		throw error(404, 'Not Found');
	}

	return await getHomePage({ sort: params.sort, timeFrame: url.searchParams.get('t') ?? 'day' });
}
