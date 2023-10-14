import { getHomePage } from '~/lib/reddit/home';

export async function load() {
	return await getHomePage();
}
