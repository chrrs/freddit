import { redirect } from '@sveltejs/kit';

export function GET({ params, url }) {
	let path = `/user/${params.route}`;

	if (url.searchParams.size > 0) {
		path += `?${url.searchParams.toString()}`;
	}

	throw redirect(301, path);
}
