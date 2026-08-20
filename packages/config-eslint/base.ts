import js from '@eslint/js';
import {defineConfig} from 'eslint/config';
import turbo from 'eslint-plugin-turbo';

export const baseConfig = defineConfig([
	{
		files: ['**/*.{js,ts}'],
		plugins: {
			js,
			turbo,
		},
		extends: [
			js.configs.recommended,
		],
	},
]);
