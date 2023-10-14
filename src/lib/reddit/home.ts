import { load } from 'cheerio';
import type { Post } from './types';
import { extractPosts, fetchBase } from './util';

export interface HomePage {
	posts: Post[];
}

export async function getHomePage(): Promise<HomePage> {
	const res = await fetchBase();
	const $ = load(res);

	const siteTable = $('#siteTable');
	if (siteTable.length === 0) {
		throw new Error('no siteTable in page');
	}

	return {
		posts: extractPosts(siteTable),
	};
}
