import type { Post } from './post';
import { load, type Cheerio, type Element } from 'cheerio';

const BASE_URL = 'https://old.reddit.com/';

export async function getHomePagePosts(after?: string): Promise<Post[]> {
	const res = await fetch(BASE_URL + (after ? `?after=${after}` : '')).then((res) => res.text());
	const $ = load(res);

	const siteTable = $('#siteTable');
	if (siteTable.length === 0) {
		throw new Error('no siteTable in page');
	}

	return extractPosts(siteTable);
}

function extractPosts(siteTable: Cheerio<Element>): Post[] {
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

				author: el.attribs['data-author'] ?? 'ghost',
				subreddit: el.attribs['data-subreddit'],
				timestamp: Number(el.attribs['data-timestamp']),
				nsfw: Boolean(el.attribs['data-nsfw']),
				spoiler: Boolean(el.attribs['data-spoiler']),

				comments_url: el.attribs['data-permalink'] ?? '/',
				comments: Number(el.attribs['data-comments-count']),
				score: Number(el.attribs['data-score']),
			};
		});
}
