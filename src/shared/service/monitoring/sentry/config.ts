import { replayIntegration } from '@sentry/browser';
import type { Integration } from '@sentry/core';

import type { IBaseSentryOptions } from './base-sentry-service';

export const BASE_OPTIONS = {
	timeout: 2000,
	debug: false,
	sampleRate: 0.5,
	tracesSampleRate: 0.5,
	attachStacktrace: true,
	autoSessionTracking: true,
	integrations: [
		replayIntegration({
			networkDetailAllowUrls: [window.location.origin],
			networkRequestHeaders: ['Cache-Control'],
			networkResponseHeaders: ['Referrer-Policy'],
		}) as Integration,
	],
	performance: true,
} as const satisfies IBaseSentryOptions;
