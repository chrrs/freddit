import type { Post } from './post';
import { load, type Cheerio, type Element } from 'cheerio';

export const BASE_URL = 'https://old.reddit.com';

export async function fetchBase(path: string): Promise<string> {
	return await fetch(BASE_URL + path, {
		headers: {
			'x-over18': 'true',
			Cookie: 'over18=1',
		},
	}).then((res) => res.text());
}

export async function getHomePagePosts(after?: string): Promise<Post[]> {
	const res = await fetchBase(after ? `?after=${after}` : '');
	const $ = load(res);

	const siteTable = $('#siteTable');
	if (siteTable.length === 0) {
		throw new Error('no siteTable in page');
	}

	return extractPosts(siteTable);
}

export function extractPosts(siteTable: Cheerio<Element>): Post[] {
	return siteTable
		.children('.thing:not(.promoted)')
		.toArray()
		.map((el) => {
			const $ = load(el);
			return {
				// FIXME: Generate a new ID.
				id: el.attribs['data-fullname'] ?? '',
				title: $('.top-matter > p.title > a.title').text(),
				flair: $('.top-matter > p.title > span.linkflairlabel').text(),
				data_url: el.attribs['data-url'],
				domain: el.attribs['data-domain'],
				self: el.attribs['class'].includes(' self'),

				author: el.attribs['data-author'] ?? 'ghost',
				subreddit: el.attribs['data-subreddit'],
				timestamp: Number(el.attribs['data-timestamp']),
				nsfw: el.attribs['data-nsfw'] === 'true',
				spoiler: el.attribs['data-spoiler'] === 'true',

				comments_url: el.attribs['data-permalink'] ?? '/',
				comments: Number(el.attribs['data-comments-count']),
				score: Number(el.attribs['data-score']),
			};
		});
}
