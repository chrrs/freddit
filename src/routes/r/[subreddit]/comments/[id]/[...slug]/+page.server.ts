import { cacheHeaders } from '~/lib/cache';
import { getPost } from '~/lib/reddit/post.js';

export async function load({ setHeaders, params }) {
	setHeaders(cacheHeaders);

	return await getPost(params.subreddit, params.id);
}
