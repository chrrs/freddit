import { error } from '@sveltejs/kit';
import { getSubreddit } from '~/lib/reddit/subreddit.js';

export async function load({ params }) {
	const subreddit = await getSubreddit(params.subreddit);

	if (subreddit === undefined) {
		throw error(404, 'Not Found');
	}

	return subreddit;
}
