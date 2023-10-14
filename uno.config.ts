import { defineConfig, presetWind, transformerDirectives } from 'unocss';

export default defineConfig({
	blocklist: ['sticky', 'container'],
	presets: [presetWind()],
	transformers: [transformerDirectives()],
});
