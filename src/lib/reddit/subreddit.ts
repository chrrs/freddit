import { load } from 'cheerio';
import { extractPosts, fetchBase } from '.';
import type { Post } from './post';

export interface Subreddit {
	name: string;
	posts: Post[];
}

export async function getSubreddit(subreddit: string, after?: string): Promise<Subreddit> {
	const res = await fetchBase(`/r/${subreddit}` + (after ? `?after=${after}` : ''));
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
