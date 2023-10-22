import { load } from 'cheerio';
import type { Post } from './types';
import { extractPost, fetchBase } from './util';

export interface PostPage {
	post: Post;
}

export async function getPost(subreddit: string, id: string): Promise<PostPage> {
	const res = await fetchBase(`/r/${subreddit}/comments/${id}`);

	const $ = load(res);

	return {
		post: extractPost(
			$('#siteTable > .thing, #siteTable > .pinnable-placeholder > .pinnable-content > .thing')[0]
		),
	};
}
