import path from 'path';
import { readFileSync } from 'fs';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import vueDevTools from 'vite-plugin-vue-devtools';
import { visualizer } from 'rollup-plugin-visualizer';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		visualizer({ open: true }),
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag === 'i88-chart',
				},
			},
		}),
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
				target: 'https://gateway.planet9.uk',
				changeOrigin: true,
				secure: true,
			},
		},
	},
	build: {
		target: 'es2017',
		cssCodeSplit: true,
		sourcemap: false,
		minify: 'terser',
		terserOptions: {
			parse: {
				ecma: 2017,
			},
			compress: {
				inline: 2,
				passes: 3,
				collapse_vars: true,
				reduce_vars: true,
				unused: true,
				dead_code: true,
				pure_getters: true,
				drop_console: true,
				drop_debugger: true,
				ecma: 2017,
				comparisons: false,
			},
			mangle: true,
			output: {
				ecma: 2017,
				comments: false,
				ascii_only: true,
			},
		},
		rollupOptions: {
			output: {
				manualChunks: {
					vue: ['vue', 'vue-router', 'pinia', '@unhead/vue'],
					tanstack: ['@tanstack/vue-query'],
					chart: [
						'chart.js',
						'chartjs-adapter-date-fns',
						'chartjs-plugin-annotation',
						'chartjs-chart-treemap',
					],
					lightweightCharts: ['lightweight-charts', 'fancy-canvas'],
					vcalendar: ['v-calendar'],
					vuedraggable: ['vuedraggable'],
					datefns: ['date-fns'],
					markdown: ['markdown-it', 'dompurify'],
					indicators: ['technicalindicators'],
					vueuse: ['@vueuse/core', '@vueuse/integrations'],
					socket: ['socket.io-client'],
					grid: ['grid-layout-plus'],
					utils: ['uuid', 'mitt', 'zod', 'decimal.js', 'ofetch'],
					sharedComponents: ['@shared/component-library'],
				},
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
				assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
			},
		},
	},
});
