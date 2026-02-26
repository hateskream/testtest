import {
	init as SentryInit,
	vueIntegration,
	browserTracingIntegration,
} from '@sentry/vue';
import type { App } from 'vue';
import type { Router } from 'vue-router';

import { SentryService, type IBaseSentryOptions } from './base-sentry-service';

interface IOptions {
	app: App;
	router: Router;
	dsn: string;
	release: string;
}

export class VueSentryService extends SentryService {
	constructor({ app, router, dsn, release }: IOptions) {
		super({
			dsn,
			release,
			creatorInstance: (baseOptions: IBaseSentryOptions) => {
				const {
					integrations: baseIntegrations,
					...restBaseOptions
				} = baseOptions;

				const localIntegrations = [
					vueIntegration({
						tracingOptions: {
							hooks: ['activate', 'mount', 'update'],
							trackComponents: false,
						},
					}),
					browserTracingIntegration({ router }),
				];

				SentryInit({
					app,
					dsn,
					release,
					attachProps: true,
					integrations: [
						...(baseIntegrations ?? []),
						...localIntegrations,
					],
					...restBaseOptions,
				});
			},
		});
	}
}
