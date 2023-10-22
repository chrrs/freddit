import { SHOW_NSFW } from '$env/static/private';
import { type Cheerio, type Element, load } from 'cheerio';
import type { DataUrl, Post } from './types';
import sanitizeHtml from 'sanitize-html';

export const BASE_URL = 'https://old.reddit.com';

export async function fetchBase(path: string = ''): Promise<string> {
	return await fetch(BASE_URL + path, {
		headers: {
			Accept: 'text/html',
			Cookie: SHOW_NSFW === 'true' ? 'over18=1' : '',
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

	const thumbnail = $('a.thumbnail > img').attr('src');

	// FIXME: Proxy these URL's somehow
	const url = el.attribs['data-url'];
	let data_url: DataUrl;
	if (el.attribs['class'].includes(' self')) {
		data_url = { type: 'self' };

		const content = $('.expando form .usertext-body .md');
		if (content.length > 0) {
			data_url.content = sanitizeHtml(content.html() ?? '', {
				allowedAttributes: {
					...sanitizeHtml.defaults.allowedAttributes,
					th: ['align'],
					td: ['align'],
				},
			});
		}
	} else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].some((ext) => url.endsWith(ext))) {
		data_url = { type: 'image', url };
	} else if (url.startsWith('https://v.redd.it/')) {
		data_url = { type: 'video', url: `${url}/HLSPlaylist.m3u8` };
	} else if (/^https?:\/\/(v3\.|www\.)?redgifs\.com\/watch/gi.test(url)) {
		data_url = {
			type: 'embed',
			embed_url: url.replace(
				/^https?:\/\/(v3\.|www\.)?redgifs\.com\/watch/gi,
				'https://www.redgifs.com/ifr'
			),
			original_url: url,
			thumbnail,
		};
	} else if (/https?:\/\/((www\.)?youtube\.com\/watch\?v=|youtu\.be\/)/gi.test(url)) {
		data_url = {
			type: 'embed',
			embed_url: url.replace(
				/https?:\/\/((www\.)?youtube\.com\/watch\?v=|youtu\.be\/)/gi,
				'https://www.youtube.com/embed/'
			),
			original_url: url,
			thumbnail,
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
			name: el.attribs['data-author'] ?? '[deleted]',
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

export function validateSort(sort: string | undefined): boolean {
	return sort === undefined || ['hot', 'top', 'rising', 'controversial', 'new'].includes(sort);
}
