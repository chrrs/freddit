import { getSubreddit } from '~/lib/reddit/subreddit.js';

export async function load({ params }) {
	return await getSubreddit(params.subreddit);
}
