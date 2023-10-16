import { getPost } from '~/lib/reddit/post.js';

export const config = {
	isr: { expiration: 60 },
};

export async function load({ params }) {
	return await getPost(params.subreddit, params.id);
}
