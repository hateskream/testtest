import { type ILogger, type ILogOptions, type LogLevel } from './logger-interface';
import { SentryService } from './sentry';

export class ProductionLogger implements ILogger {
	private globalContext: Record<string, unknown> = {};
	private globalTags: Record<string, string> = {};

	constructor(private readonly logService: SentryService) {}

	public debug(_: string): void {
		// ignored in production
	}

	public info(_: string): void {
		// ignored in production
	}

	public warn(message: string, options?: ILogOptions): void {
		this.send('warning', message, options);
	}

	public error(message: string, options?: ILogOptions): void {
		this.send('error', message, options);
	}

	public exception(error: Error, options?: ILogOptions): void {
		try {
			const { context = {}, tags = {}, level } = options ?? {};

			this.logService.error(error, {
				level: level || 'error',
				tags: { ...this.globalTags, ...tags },
				extras: {
					message: options?.context?.message ?? error.message,
					...this.globalContext,
					...context,
				},
			});
		} catch (sendErr) {
			// oxlint-disable-next-line no-console
			console.error('Failed to send exception to Sentry:', error, sendErr);
		}
	}

	public setContext(context: Record<string, unknown>): void {
		this.globalContext = { ...this.globalContext, ...context };
	}

	public setTags(tags: Record<string, string>): void {
		this.globalTags = { ...this.globalTags, ...tags };
	}

	private send(level: LogLevel, message: string, options?: ILogOptions): void {
		try {
			const { context = {}, tags = {} } = options ?? {};

			const mergedTags = { ...this.globalTags, ...tags };
			const mergedExtras = { ...this.globalContext, ...context };

			if (options?.error) {
				this.logService.error(options.error, {
					level,
					tags: mergedTags,
					extras: { message, ...mergedExtras },
				});
			} else {
				this.logService.message(message, {
					level,
					tags: mergedTags,
					extras: mergedExtras,
				});
			}
		} catch (error) {
			if (level === 'warning') {
				// oxlint-disable-next-line no-console
				console.warn('Failed to send warning to Sentry:', message, error);
			} else {
				// oxlint-disable-next-line no-console
				console.error('Failed to send error to Sentry:', message, error);
			}
		}
	}
}
