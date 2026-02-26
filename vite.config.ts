import path from 'path';

import type { Plugin, ProxyOptions } from 'vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { visualizer } from 'rollup-plugin-visualizer';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import svgLoader from 'vite-svg-loader';

import pkg from './package.json' with { type: 'json' };

// Plugin to filter out :deep warnings from lightningcss
const filterDeepWarnings = (): Plugin => {
	return {
		name: 'filter-deep-warnings',
		buildStart() {
			const originalWarn = console.warn;
			console.warn = (...args: unknown[]) => {
				const message = String(args[0] || '');
				if (
					message.includes('\'deep\' is not recognized') ||
					message.includes('\'v-deep\' is not recognized')
				) {
					return;
				}
				originalWarn.apply(console, args);
			};
		},
	};
};

// The backend WAF treats percent-encoded special chars (e.g. %5E for ^) in headers as
// LDAP injection. Strip origin and referer before forwarding, and preserve the raw
// request path so node-http-proxy doesn't re-encode it.
const sanitizeProxyRequest: NonNullable<ProxyOptions['configure']> = (proxy) => {
	proxy.on('proxyReq', (proxyReq, req) => {
		if (req.url) {
			proxyReq.path = req.url;
		}
		proxyReq.removeHeader('origin');
		proxyReq.removeHeader('referer');
	});
};

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
		filterDeepWarnings(),
		svgLoader(),
	],
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
	resolve: {
		alias: {
			'@': path.resolve('src/'),
		},
	},
	server: {
		proxy: {
			'/api/feedback': {
				target: 'https://demo-dev.planet9.uk/',
				changeOrigin: true,
				configure: sanitizeProxyRequest,
			},
			'/api': {
				target: 'https://gateway.planet9.uk',
				changeOrigin: true,
				secure: true,
				configure: sanitizeProxyRequest,
			},
		},
	},
	css: {
		transformer: 'lightningcss',
		lightningcss: {
			targets: browserslistToTargets(browserslist()),
			cssModules: {
				pattern: '[local]__[hash]',
			},
		},
	},
	build: {
		target: 'es2019',
		cssCodeSplit: true,
		sourcemap: false,
		minify: 'terser',
		cssMinify: 'lightningcss',
		terserOptions: {
			ecma: 2019,
			compress: {
				ecma: 2019,
				inline: 2,
				passes: 3,
				collapse_vars: true,
				reduce_vars: true,
				unused: true,
				dead_code: true,
				pure_getters: true,
				drop_console: true,
				drop_debugger: true,
				comparisons: false,
			},
			mangle: true,
			format: {
				ecma: 2019,
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
					utils: ['uuid', 'mitt', 'zod', 'ofetch'],
					sharedComponents: ['@shared/component-library'],
				},
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
				assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
			},
		},
	},
});
