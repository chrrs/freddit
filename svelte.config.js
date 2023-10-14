import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import unocss from '@unocss/svelte-scoped/preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), unocss()],

	kit: {
		adapter: adapter(),
		alias: {
			'~/*': 'src/*',
		},
	},
};

export default config;
