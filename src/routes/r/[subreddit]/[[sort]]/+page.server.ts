import { error } from '@sveltejs/kit';
import { getSubreddit } from '~/lib/reddit/subreddit.js';
import { validateSort } from '~/lib/reddit/util';

export async function load({ params }) {
	if (!validateSort(params.sort)) {
		throw error(404, 'Not Found');
	}

	const subreddit = await getSubreddit(params.subreddit, { sort: params.sort });

	if (subreddit === undefined) {
		throw error(404, 'Not Found');
	}

	return subreddit;
}
