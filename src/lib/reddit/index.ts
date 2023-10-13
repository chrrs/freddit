import { extractPosts, type Post } from './post';
import { load } from 'cheerio';

export const BASE_URL = 'https://old.reddit.com';

export async function fetchBase(path: string = ''): Promise<string> {
	return await fetch(BASE_URL + path, {
		headers: {
			'x-over18': 'true',
			Cookie: 'over18=1',
		},
	}).then((res) => res.text());
}

export interface HomePage {
	posts: Post[];

	before?: string;
	after?: string;
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
