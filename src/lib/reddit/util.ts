import { type Cheerio, type Element, load } from 'cheerio';
import type { DataUrl, Post } from './types';

export const BASE_URL = 'https://old.reddit.com';

export async function fetchBase(path: string = ''): Promise<string> {
	return await fetch(BASE_URL + path, {
		headers: {
			Accept: 'text/html',
			Cookie: 'over18=1',
		},
	}).then((res) => res.text());
}

export function extractPosts(siteTable: Cheerio<Element>): Post[] {
	// FIXME: Detect when there are no posts.
	// FIXME: Detect private subreddits
	// FIXME: Detect when subreddit does not exist (currently goes to r/subreddits)

	return siteTable.children('.thing:not(.promoted)').toArray().map(extractPost);
}

export function extractPost(el: Element): Post {
	const $ = load(el);

	// FIXME: Proxy these URL's somehow
	const url = el.attribs['data-url'];
	let data_url: DataUrl;
	if (el.attribs['class'].includes(' self')) {
		data_url = { type: 'self' };
	} else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].some((ext) => url.endsWith(ext))) {
		data_url = { type: 'image', url };
	} else if (url.startsWith('https://v.redd.it/')) {
		data_url = { type: 'video', url: `${url}/HLSPlaylist.m3u8` };
	} else if (url.startsWith('https://www.redgifs.com/watch')) {
		data_url = {
			type: 'embed',
			url: url.replace('https://www.redgifs.com/watch', 'https://www.redgifs.com/ifr'),
		};
	} else if (url.startsWith('https://v3.redgifs.com/watch')) {
		data_url = {
			type: 'embed',
			url: url.replace('https://v3.redgifs.com/watch', 'https://www.redgifs.com/ifr'),
		};
	} else {
		data_url = { type: 'url', url };
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
}
