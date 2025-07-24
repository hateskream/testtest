import path from 'path';
import { readFileSync } from 'fs';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import vueDevTools from 'vite-plugin-vue-devtools';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		createSvgIconsPlugin({
			iconDirs: [path.resolve(process.cwd(), './src/assets/icons')],
			symbolId: 'icon-[name]',
		}),
		vueDevTools(),
	],
	define: {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
	resolve: {
		alias: {
			'@': path.resolve('src/'),
		},
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:1488/',
				changeOrigin: true,
				prependPath: true,
				rewrite: pathUri => pathUri.replace(/^\/api/, ''),
			},
		},
	},
});
