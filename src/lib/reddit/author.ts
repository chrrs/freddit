import type { Cheerio, Element } from 'cheerio';

export type Distinguished = 'moderator' | 'admin' | 'admin emeritus';

export interface Author {
	name: string;
	flair?: string;
	distinguished?: Distinguished;
	originalPoster?: boolean;
}

export function extractDistinguished(author: Cheerio<Element>): Distinguished | undefined {
	if (author.hasClass('moderator')) {
		return 'moderator';
	} else if (author.hasClass('admin')) {
		return 'admin';
	} else if (author.hasClass('alum')) {
		return 'admin emeritus';
	}

	return undefined;
}
