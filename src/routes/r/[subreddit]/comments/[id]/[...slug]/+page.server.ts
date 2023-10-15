import { getPost } from '~/lib/reddit/post.js';

export async function load({ params }) {
	return await getPost(params.subreddit, params.id);
}
