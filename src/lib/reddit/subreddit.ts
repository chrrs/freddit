import type { CheerioAPI } from 'cheerio';
import { extractPost, type Post } from './post';

export type Subreddit =
	| {
			type: 'banned';
			reason: string;
	  }
	| {
			type: 'nsfw-blocked';
	  }
	| {
			type: 'private';
			reason: string;
	  }
	| {
			type: 'public';
			info: SubredditInfo;
			posts: Post[];
	  };

export interface SubredditInfo {
	name: string;
	subscribers: number;
	online: number;
}

export function extractSubreddit($: CheerioAPI): Subreddit | undefined {
	if ($('title').text() === 'search results') {
		return undefined;
	}

	const interstitial = $('.content > .interstitial');
	if (interstitial.length > 0) {
		const type = interstitial.find('.interstitial-image').attr('alt');

		if (type === 'banned') {
			return {
				type: 'banned',
				reason: interstitial.find('.md > p').text(),
			};
		} else if (type === 'over 18') {
			return {
				type: 'nsfw-blocked',
			};
		} else if (type === 'private') {
			return {
				type: 'private',
				reason: interstitial.find('.md > .interstitial-subreddit-description > p').text(),
			};
		} else {
			throw new Error('unknown subreddit state: ' + type);
		}
	}

	return {
		type: 'public',
		info: {
			name: $('#header .redditname > a').text(),
			subscribers: Number($('.subscribers > .number').text().replaceAll(',', '')),
			online: Number($('.users-online > .number').text().replaceAll(',', '')),
		},
		posts: $('#siteTable')
			.children('.thing:not(.promoted)')
			.toArray()
			.map((el) => extractPost($, el)),
	};
}
