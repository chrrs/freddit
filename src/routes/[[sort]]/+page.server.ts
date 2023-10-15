import { error } from '@sveltejs/kit';
import { getHomePage } from '~/lib/reddit/home';
import { validateSort } from '~/lib/reddit/util';

export async function load({ params }) {
	if (!validateSort(params.sort)) {
		throw error(404, 'Not Found');
	}

	return await getHomePage({ sort: params.sort });
}
