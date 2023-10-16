import { error } from '@sveltejs/kit';
import { getSubreddit } from '~/lib/reddit/subreddit.js';
import { validateSort } from '~/lib/reddit/util';

export const config = {
	isr: { expiration: 60 },
};

export async function load({ params, url }) {
	if (!validateSort(params.sort)) {
		throw error(404, 'Not Found');
	}

	const subreddit = await getSubreddit(params.subreddit, {
		sort: params.sort,
		timeFrame: url.searchParams.get('t') ?? 'day',
	});

	if (subreddit === undefined) {
		throw error(404, 'Not Found');
	}

	return subreddit;
}
