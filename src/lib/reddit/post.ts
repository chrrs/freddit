import { load, type Element, type Cheerio } from 'cheerio';
import type { Post, Comment } from './types';
import { extractPost, fetchBase, sanitizeMd } from './util';

export interface PostPage {
	post: Post;

	comments: Comment[];
	continuation?: string;
}

export async function getPost(subreddit: string, id: string): Promise<PostPage> {
	const res = await fetchBase(`/r/${subreddit}/comments/${id}`);

	const $ = load(res);

	return {
		post: extractPost(
			$('#siteTable > .thing, #siteTable > .pinnable-placeholder > .pinnable-content > .thing')[0]
		),

		comments: extractComments($('.commentarea > .sitetable')),
	};
}

function extractComments(nestedSiteTable: Cheerio<Element>): Comment[] {
	return nestedSiteTable
		.children('.thing.comment')
		.toArray()
		.map((comment) => {
			const $ = load(comment);
			const entry = $(comment).children('.entry');

			const timestamp = new Date(entry.find('.tagline > time').attr('datetime') ?? '0').getTime();

			return {
				id: comment.attribs['data-fullname'] ?? `comment-${timestamp}`,
				author: {
					name: comment.attribs['data-author'] ?? '[deleted]',
					role:
						entry.find('.author.admin').length > 0
							? 'admin'
							: entry.find('.author.moderator').length > 0
							? 'moderator'
							: undefined,
				},

				content: sanitizeMd(entry.find('.usertext-body > .md').html() ?? ''),
				timestamp,

				sticky: comment.attribs['class'].includes(' stickied'),
				score: Number(entry.find('.tagline .score.unvoted').text().replaceAll(/[^\d]/g, '')),

				replies: extractComments($(comment).find('> .child > .sitetable')),
			};
		});
}
