import type { CheerioAPI, Element } from 'cheerio';
import { extractDistinguished, type Author } from './author';
import { sanitizeMd } from './util';

export interface Thread {
	children: Comment[];
	continuationLength?: number;
}

export interface Comment {
	id: string;

	content: { html: string };

	author?: Author;
	timestamp: number;

	sticky: boolean;
	score: number;

	replies: Thread;
}

export function extractComment($: CheerioAPI, el: Element, op?: string): Comment {
	const thing = $(el);

	const tagline = thing.find('> .entry > p.tagline');
	const authorName = thing.attr('data-author');

	const childrenTable = thing.find('> .child > .sitetable');

	const moreChildren = childrenTable.find('> .thing.morechildren');
	const continuationLength =
		moreChildren.length > 0 ? Number(moreChildren.text().replaceAll(/[^\d]/g, '')) : undefined;

	return {
		id: thing.attr('data-fullname') ?? `comment-${thing.index()}`,

		content: {
			html: sanitizeMd(thing.find('> .entry > form > .usertext-body > .md').html() || '[deleted]'),
		},

		author: authorName
			? {
					name: authorName,
					distinguished: extractDistinguished(tagline.find('> a.author')),
					originalPoster: authorName === op,
			  }
			: undefined,
		timestamp: new Date(tagline.find('> time').attr('datetime') ?? 0).getTime(),

		sticky: thing.hasClass('stickied'),
		score: Number(tagline.find('> .score.unvoted').attr('title')),

		replies: {
			children: childrenTable
				.children('.thing.comment')
				.toArray()
				.map((el) => extractComment($, el, op)),
			continuationLength,
		},
	};
}
