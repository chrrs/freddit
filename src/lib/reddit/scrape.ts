import { env } from '$env/dynamic/private';
import { load } from 'cheerio';
import { extractPost, type Post } from './post';
import { extractSubreddit, type Subreddit } from './subreddit';
import { extractComment } from './comment';

const BASE_URL = 'https://old.reddit.com';

export interface SortOptions {
	sort: string | undefined;
	timeFrame?: string;
}

export async function fetchBase(
	path: string,
	options: {
		query?: Record<string, unknown>;
		sort?: SortOptions;
	} = {}
): Promise<string> {
	const url = new URL(path, BASE_URL);

	for (const [name, value] of Object.entries(options.query ?? {})) {
		if (value !== undefined) {
			url.searchParams.set(name, (value as string).toString());
		}
	}

	if (options.sort) {
		url.pathname += `/${options.sort.sort ?? 'hot'}`;

		if (options.sort.timeFrame) {
			url.searchParams.set('t', options.sort.timeFrame);
		}
	}

	return await fetch(url, {
		headers: {
			Accept: 'text/html',
			Cookie: env.SHOW_NSFW === 'true' ? 'over18=1' : '',
		},
	}).then((res) => res.text());
}

export interface Home {
	posts: Post[];
	pagelinks: {
		next?: string;
		previous?: string;
	};
}

export async function fetchHome(
	options: {
		sort?: SortOptions;
		count?: string;
		before?: string;
		after?: string;
	} = {}
): Promise<Home> {
	const res = await fetchBase('', {
		sort: options.sort,
		query: { count: options.count, before: options.before, after: options.after },
	});
	const $ = load(res);

	return {
		posts: $('#siteTable')
			.children('.thing:not(.promoted)')
			.toArray()
			.map((el) => extractPost($, el)),
		pagelinks: {
			next: $('.next-button > a')
				.attr('href')
				?.replace(/^https?:\/\/old\.reddit\.com/g, ''),
			previous: $('.prev-button > a')
				.attr('href')
				?.replace(/^https?:\/\/old\.reddit\.com/g, ''),
		},
	};
}

export async function fetchSubreddit(
	subreddit: string,
	options: {
		sort?: SortOptions;
		count?: string;
		before?: string;
		after?: string;
	} = {}
): Promise<Subreddit | undefined> {
	const res = await fetchBase(`r/${subreddit}`, {
		sort: options.sort,
		query: { count: options.count, before: options.before, after: options.after },
	});
	const $ = load(res);

	return extractSubreddit($);
}

export async function fetchPost(
	subreddit: string,
	id: string,
	options: { thread?: string; sort?: SortOptions } = {}
): Promise<Post | undefined> {
	const res = await fetchBase(`/r/${subreddit}/comments/${id}/_/${options.thread ?? ''}`, {
		sort: options.sort,
	});
	const $ = load(res);

	if ($('#classy-error > h1').text() === 'page not found') {
		return undefined;
	}

	const el = $(
		'#siteTable > .thing, #siteTable > .pinnable-placeholder > .pinnable-content > .thing'
	)[0];

	const post = extractPost($, el);

	const childrenTable = $(`#siteTable_${post.id}`);
	const moreChildren = childrenTable.find('> .thing.morechildren');
	const continuationLength =
		moreChildren.length > 0 ? Number(moreChildren.text().replaceAll(/[^\d]/g, '')) : undefined;

	post.replies = {
		children: childrenTable
			.children('.thing.comment')
			.toArray()
			.map((el) => extractComment($, el, post.author?.name)),
		continuationLength,
	};

	return post;
}
