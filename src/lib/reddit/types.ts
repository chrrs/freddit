export type DataUrl = SelfDataUrl | UrlDataUrl | ImageDataUrl | VideoDataUrl | EmbedDataUrl;

export interface SelfDataUrl {
	type: 'self';
	content?: string;
}

export interface UrlDataUrl {
	type: 'url';
	url: string;
}

export interface ImageDataUrl {
	type: 'image';
	url: string;
}

export interface VideoDataUrl {
	type: 'video';
	url: string;
}

export interface EmbedDataUrl {
	type: 'embed';
	embed_url: string;
	original_url: string;
	thumbnail?: string;
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
