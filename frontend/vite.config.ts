import path from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		svgLoader({
			svgoConfig: {
				plugins: [
					{
						name: 'cleanupIds',
						params: {
							minify: true,
						},
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve('src/'),
		},
	},
});
