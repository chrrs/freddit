export interface Post {
	id: string;
	title: string;
	flair?: string;
	data_url?: string;
	domain: string;

	author: string;
	subreddit?: string;
	timestamp: number;
	nsfw: boolean;
	spoiler: boolean;

	comments_url: string;
	comments: number;
	score: number;
}
