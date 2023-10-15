import { redirect } from '@sveltejs/kit';

export function load({ url }) {
	const q = url.searchParams.get('q');

	if (q && (q.startsWith('r/') || q.startsWith('u/'))) {
		throw redirect(302, '/' + q);
	} else if (q && (q.startsWith('/r/') || q.startsWith('/u/'))) {
		throw redirect(302, q);
	}
}
