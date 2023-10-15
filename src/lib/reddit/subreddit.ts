import { load } from 'cheerio';
import type { Post } from './types';
import { extractPosts, fetchBase } from './util';

type Subreddit = CommonSubreddit & (NormalSubreddit | BannedSubreddit | PrivateSubreddit);

export interface CommonSubreddit {
	name: string;
	multi: boolean;
}

export interface NormalSubreddit {
	subscribers: number;
	online: number;

	posts: Post[];
}

export interface BannedSubreddit {
	banned: true;
	reason: string;
}

export interface PrivateSubreddit {
	private: true;
	reason: string;
}

export async function getSubreddit(
	subreddit: string,
	options: { sort?: string; timeFrame?: string } = {}
): Promise<Subreddit | undefined> {
	const res = await fetchBase(
		`/r/${subreddit}/${options.sort ?? 'hot'}?t=${options.timeFrame ?? ''}`
	);

	const $ = load(res);

	if ($('title').text() === 'search results') {
		return undefined;
	}

	const name = $('#header .redditname > a').text();
	const multi = subreddit.includes('+');

	const interstitial = $('.content > .interstitial');
	if (interstitial.length > 0) {
		const type = interstitial.find('.interstitial-image').attr('alt');
		if (type === 'banned') {
			return {
				name,
				multi,

				banned: true,
				reason: interstitial.find('.md > p').text(),
			};
		} else if (type === 'private') {
			return {
				name,
				multi,

				private: true,
				reason: interstitial.find('.md > .interstitial-subreddit-description > p').text(),
			};
		} else {
			throw new Error('unknown subreddit state: ' + type);
		}
	}

	const siteTable = $('#siteTable');
	if (siteTable.length === 0) {
		throw new Error('no siteTable in page');
	}

	return {
		name,
		multi,

		subscribers: Number($('.subscribers > .number').text().replaceAll(',', '')),
		online: Number($('.users-online > .number').text().replaceAll(',', '')),

		posts: extractPosts(siteTable),
	};
}
