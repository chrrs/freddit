// FIXME: Workaround for https://github.com/sveltejs/kit/issues/10836

export { load } from './[sort]/+page.server';

export const config = {
	isr: { expiration: 60 },
};
