import { captureException, captureMessage, Scope, withScope } from '@sentry/browser';
import type { Integration } from '@sentry/core';

import type { LogLevel } from '../logger-interface';
import { BASE_OPTIONS } from './config';

export interface IBaseSentryOptions {
	timeout: number;
	debug: boolean;
	sampleRate: number;
	tracesSampleRate: number;
	attachStacktrace: boolean;
	autoSessionTracking: boolean;
	integrations: Integration[];
	performance: boolean;
}

export interface IBaseSentryServiceConfig {
	dsn: string;
	release: string;
	creatorInstance: (baseOptions: IBaseSentryOptions) => void;
}

type LogContext = {
	tags?: Record<string, string>;
	extras?: Record<string, unknown>;
	level?: LogLevel;
};

export abstract class SentryService {
	constructor({ dsn, release, creatorInstance }: IBaseSentryServiceConfig) {
		if (!dsn) {
			throw new Error('Для корректной работы LogService необходимо указать DSN (dsn)');
		}
		if (!release) {
			throw new Error('Для корректной работы LogService необходимо указать версию релиза приложения (release)');
		}

		creatorInstance(BASE_OPTIONS);
	}

	public error(err: unknown, context?: LogContext): void {
		this.withContext(context, () => {
			captureException(err);
		});
	}

	public message(message: string, context?: LogContext): void {
		this.withContext(context, () => {
			captureMessage(message, context?.level);
		});
	}

	private withContext(context: LogContext | undefined, cb: () => void): void {
		withScope((scope) => {
			this.applyScope(scope, context);
			cb();
		});
	}

	private applyScope(scope: Scope, context?: LogContext): void {
		if (!context) {
			return;
		}

		if (context.tags) {
			scope.setTags(context.tags);
		}
		if (context.extras) {
			scope.setExtras(context.extras);
		}
		if (context.level) {
			scope.setLevel(context.level);
		}
	}
}
