import type { App } from 'vue';
import type { Router } from 'vue-router';

import { DevLogger } from './dev-logger';
import type { ILogger } from './logger-interface';
import { ProductionLogger } from './production-logger';
import { EnvironmentName, getEnvironmentName } from '@/shared/lib';
import { SentryService, VueSentryService } from './sentry';

const envNameToCreator = {
	[EnvironmentName.PROD]: function (sentry: SentryService) {
		return new ProductionLogger(sentry);
	},
	[EnvironmentName.DEMO]: function () {
		return new DevLogger();
	},
	[EnvironmentName.DEV]: function () {
		return new DevLogger();
	},
} as const;

interface ILoggerOptions {
	app: App;
	router: Router;
}

let instance: ILogger | null = null;

export function registerLogger({ app, router }: ILoggerOptions) {
	const env = getEnvironmentName();

	if (env === EnvironmentName.PROD) {
		const sentry = new VueSentryService({
			app,
			router,
			dsn: import.meta.env.VITE_SENTRY_DSN,
			// @ts-expect-error ENV
			release: __APP_VERSION__ as string,
		});

		instance = envNameToCreator[EnvironmentName.PROD](sentry);
		return instance;
	}

	instance = envNameToCreator[env]();

	return instance;
}

export function useLogger(): ILogger {
	if (!instance) {
		return new DevLogger();
	}

	return instance;
}
