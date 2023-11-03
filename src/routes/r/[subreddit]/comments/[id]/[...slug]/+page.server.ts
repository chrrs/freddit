import { error } from '@sveltejs/kit';
import { cacheHeaders } from '~/lib/cache';
import { fetchPost } from '~/lib/reddit/scrape.js';

export async function load({ setHeaders, params }) {
	setHeaders(cacheHeaders);

	const post = await fetchPost(params.subreddit, params.id);

	if (!post) {
		throw error(404, 'Not Found');
	}

	return { post };
}
