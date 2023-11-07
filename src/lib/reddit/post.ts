import type { Cheerio, CheerioAPI, Element } from 'cheerio';
import { extractDistinguished, type Author } from './author';
import type { Thread } from './comment';
import { sanitizeMd } from './util';

export interface Post {
	id: string;
	title: string;
	flair?: string;
	domain: string;

	content: PostContent;

	author?: Author;
	subreddit: {
		name: string;
		prefixed: string;
		type: 'subreddit' | 'user';
	};
	timestamp: number;

	nsfw: boolean;
	spoiler: boolean;
	sticky: boolean;

	commentsUrl: string;
	comments: number;
	score: number;

	replies?: Thread;
}

export type PostContent =
	| {
			type: 'self';
			html?: string;
	  }
	| {
			type: 'hls';
			src: string;
	  }
	| {
			type: 'image';
			src: string;
	  }
	| {
			type: 'embed';
			embedUrl: string;
			originalUrl: string;
			thumbnailSrc?: string;
	  }
	| {
			type: 'link';
			url: string;
	  };

export function extractPost($: CheerioAPI, el: Element): Post {
	const thing = $(el);
	const title = thing.find('> .entry > .top-matter > p.title');

	const authorName = thing.attr('data-author');

	return {
		id: thing.attr('data-fullname') ?? `post-${thing.index()}`,
		title: title.find('> a.title').text(),
		flair: title.find('> span.linkflairlabel').attr('title'),
		domain: thing.attr('data-domain') ?? '',

		content: extractPostContent(thing),

		author: authorName
			? {
					name: authorName,
					distinguished: extractDistinguished(
						thing.find('> .entry > .top-matter > p.tagline > a.author')
					),
			  }
			: undefined,
		subreddit: {
			name: thing.attr('data-subreddit') ?? '[unknown]',
			prefixed: thing.attr('data-subreddit-prefixed') ?? 'r/[unknown]',
			type: thing.attr('data-subreddit-type') === 'user' ? 'user' : 'subreddit',
		},
		timestamp: Number(thing.attr('data-timestamp')),

		nsfw: thing.attr('data-nsfw') === 'true',
		spoiler: thing.attr('data-spoiler') === 'true',
		sticky: thing.hasClass('stickied'),

		commentsUrl: thing.attr('data-permalink') ?? '/404',
		comments: Number(thing.attr('data-comments-count')),
		score: Number(thing.attr('data-score')),
	};
}

// FIXME: Clean up this function.
// FIXME: Proxy these URL's somehow
export function extractPostContent(thing: Cheerio<Element>): PostContent {
	if (thing.hasClass('self')) {
		const md = thing.find('> .entry > .expando > form > .usertext-body > .md');
		if (md.length > 0) {
			return {
				type: 'self',
				html: sanitizeMd(md.html() ?? ''),
			};
		}

		return { type: 'self' };
	}

	const url = thing.attr('data-url') ?? '';
	const thumbnailSrc = thing.find('a.thumbnail > img').attr('src');

	if (['jpg', 'jpeg', 'png', 'webp', 'gif'].some((ext) => url.endsWith(ext))) {
		return { type: 'image', src: url };
	} else if (url.startsWith('https://v.redd.it/')) {
		return { type: 'hls', src: `${url}/HLSPlaylist.m3u8` };
	} else if (/^https?:\/\/(v3\.|www\.)?redgifs\.com\/watch/gi.test(url)) {
		return {
			type: 'embed',
			embedUrl: url.replace(
				/^https?:\/\/(v3\.|www\.)?redgifs\.com\/watch/gi,
				'https://www.redgifs.com/ifr'
			),
			originalUrl: url,
			thumbnailSrc,
		};
	} else if (/https?:\/\/((www\.)?youtube\.com\/watch\?v=|youtu\.be\/)/gi.test(url)) {
		return {
			type: 'embed',
			embedUrl: url.replace(
				/https?:\/\/((www\.)?youtube\.com\/watch\?v=|youtu\.be\/)/gi,
				'https://www.youtube.com/embed/'
			),
			originalUrl: url,
			thumbnailSrc,
		};
	}

	return {
		type: 'link',
		url,
	};
}
