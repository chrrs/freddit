import { type Cheerio, type Element, load } from 'cheerio';
import type { DataUrl, Post } from './types';

export const BASE_URL = 'https://old.reddit.com';

export async function fetchBase(path: string = ''): Promise<string> {
	return await fetch(BASE_URL + path, {
		headers: {
			'x-over18': 'true',
			Cookie: 'over18=1',
		},
	}).then((res) => res.text());
}

export function extractPosts(siteTable: Cheerio<Element>): Post[] {
	// FIXME: Detect when there are no posts.

	return siteTable
		.children('.thing:not(.promoted)')
		.toArray()
		.map((el) => {
			const $ = load(el);

			// FIXME: v.reddit: https://v.redd.it/q8t2hkexxztb1/HLSPlaylist.m3u8 (link + /HLSPlaylist.m3u8)
			let data_url: DataUrl;
			if (el.attribs['class'].includes(' self')) {
				data_url = { type: 'self' };
			} else {
				data_url = { type: 'url', url: el.attribs['data-url'] };
			}

			return {
				id: el.attribs['data-fullname'] ?? `post-${el.attribs['data-timestamp']}`,
				title: $('.top-matter > p.title > a.title').text(),
				flair: $('.top-matter > p.title > span.linkflairlabel').text(),

				data_url,
				domain: el.attribs['data-domain'],

				author: {
					name: el.attribs['data-author'] ?? 'ghost',
					role:
						$('.author.admin').length > 0
							? 'admin'
							: $('.author.moderator').length > 0
							? 'moderator'
							: undefined,
				},
				subreddit: el.attribs['data-subreddit'],
				timestamp: Number(el.attribs['data-timestamp']),

				nsfw: el.attribs['data-nsfw'] === 'true',
				spoiler: el.attribs['data-spoiler'] === 'true',
				sticky: el.attribs['class'].includes(' stickied'),

				post_url: el.attribs['data-permalink'] ?? '/',
				comments: Number(el.attribs['data-comments-count']),
				score: Number(el.attribs['data-score']),
			};
		});
}
