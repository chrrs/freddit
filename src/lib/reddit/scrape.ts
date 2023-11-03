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
		url.searchParams.set(name, (value as string).toString());
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

export async function fetchHome(sort?: SortOptions): Promise<Post[]> {
	const res = await fetchBase('', { sort });
	const $ = load(res);

	return $('#siteTable')
		.children('.thing:not(.promoted)')
		.toArray()
		.map((el) => extractPost($, el));
}

export async function fetchSubreddit(
	subreddit: string,
	sort?: SortOptions
): Promise<Subreddit | undefined> {
	const res = await fetchBase(`r/${subreddit}`, { sort });
	const $ = load(res);

	return extractSubreddit($);
}

export async function fetchPost(
	subreddit: string,
	id: string,
	sort?: SortOptions
): Promise<Post | undefined> {
	const res = await fetchBase(`/r/${subreddit}/comments/${id}/_/`, { sort });
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
