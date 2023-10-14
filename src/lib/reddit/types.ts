export type DataUrl = SelfDataUrl | UrlDataUrl;

export interface SelfDataUrl {
	type: 'self';
}

export interface UrlDataUrl {
	type: 'url';
	url: string;
}

export interface Author {
	name: string;
	role?: 'moderator' | 'admin';
}

export interface Post {
	id: string;
	title: string;
	flair?: string;

	data_url: DataUrl;
	domain: string;

	author: Author;
	subreddit: string;
	timestamp: number;

	nsfw: boolean;
	spoiler: boolean;
	sticky: boolean;

	post_url: string;
	comments: number;
	score: number;
}
