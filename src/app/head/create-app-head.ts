import { createHead } from '@unhead/vue/client';
import { CanonicalPlugin, InferSeoMetaPlugin, TemplateParamsPlugin } from '@unhead/vue/plugins';

export interface ICreateAppHeadOptions {
	appName: string;
	appHost?: string;
	separator?: '|' | '-' | '·' | '—' | string;
}

export function createAppHead(options: ICreateAppHeadOptions) {
	const {
		appName,
		separator = '—',
		appHost,
	} = options;

	const instance = createHead({
		plugins: [
			TemplateParamsPlugin,
			CanonicalPlugin({
				canonicalHost: appHost,
			}),
			InferSeoMetaPlugin(),
		],
	});

	instance.push({
		templateParams: {
			appName,
			separator,
		},
	});

	return instance;
}
