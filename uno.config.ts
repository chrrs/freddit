import { defineConfig, presetIcons, presetWind, transformerDirectives } from 'unocss';

export default defineConfig({
	blocklist: ['sticky', 'container'],
	presets: [presetWind(), presetIcons()],
	transformers: [transformerDirectives()],
});
