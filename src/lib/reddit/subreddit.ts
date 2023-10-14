import { load } from 'cheerio';
import type { Post } from './types';
import { extractPosts, fetchBase } from './util';

export interface Subreddit {
	name: string;
	posts: Post[];
}

export async function getSubreddit(subreddit: string): Promise<Subreddit> {
	const res = await fetchBase(`/r/${subreddit}`);

	const $ = load(res);

	const siteTable = $('#siteTable');
	if (siteTable.length === 0) {
		throw new Error('no siteTable in page');
	}

	return {
		name: $('#header .redditname').text(),
		posts: extractPosts(siteTable),
	};
}
