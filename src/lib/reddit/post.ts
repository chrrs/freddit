import { load, type Cheerio, type Element } from 'cheerio';

export interface Post {
	id: string;
	title: string;
	flair?: string;

	data_url?: string;
	domain: string;
	self: boolean;

	author: string;
	subreddit?: string;
	timestamp: number;
	nsfw: boolean;
	spoiler: boolean;
	sticky: boolean;

	comments_url: string;
	comments: number;
	score: number;
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
				sticky: el.attribs['class'].includes(' stickied'),

				comments_url: el.attribs['data-permalink'] ?? '/',
				comments: Number(el.attribs['data-comments-count']),
				score: Number(el.attribs['data-score']),
			};
		});
}
