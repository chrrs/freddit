import { error } from '@sveltejs/kit';
import { getHomePage } from '~/lib/reddit/home';
import { validateSort } from '~/lib/reddit/util';

export const config = {
	isr: { expiration: 60, allowQuery: ['t'] },
};

export async function load({ params, url }) {
	if (!validateSort(params.sort)) {
		throw error(404, 'Not Found');
	}

	return await getHomePage({ sort: params.sort, timeFrame: url.searchParams.get('t') ?? 'day' });
}
