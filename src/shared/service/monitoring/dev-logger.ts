/* eslint-disable no-console */
import { type ILogger, type ILogOptions, LogLevel } from './logger-interface';

export class DevLogger implements ILogger {
	private globalContext: Record<string, unknown> = {};
	private globalTags: Record<string, string> = {};

	debug(message: string, options?: ILogOptions): void {
		const logData = this.buildLogData(LogLevel.DEBUG, message, options);
		console.debug(`[DEBUG] ${message}`, logData);
	}

	info(message: string, options?: ILogOptions): void {
		const logData = this.buildLogData(LogLevel.INFO, message, options);
		console.info(`[INFO] ${message}`, logData);
	}

	warn(message: string, options?: ILogOptions): void {
		const logData = this.buildLogData(LogLevel.WARN, message, options);
		console.warn(`[WARN] ${message}`, logData);
	}

	error(message: string, options?: ILogOptions): void {
		const logData = this.buildLogData(LogLevel.ERROR, message, options);
		console.error(`[ERROR] ${message}`, logData);
	}

	exception(error: Error, options?: ILogOptions): void {
		const logData = this.buildLogData(LogLevel.ERROR, error.message, {
			...options,
			error,
		});

		console.group(`[EXCEPTION] ${error.message}`);
		console.error(error);
		console.log('Additional context:', logData);
		console.groupEnd();
	}

	setContext(context: Record<string, unknown>): void {
		this.globalContext = { ...this.globalContext, ...context };
	}

	setTags(tags: Record<string, string>): void {
		this.globalTags = { ...this.globalTags, ...tags };
	}

	private buildLogData(level: LogLevel, message: string, options?: ILogOptions): unknown {
		return {
			timestamp: new Date().toISOString(),
			level,
			message,
			context: {
				...this.globalContext,
				...options?.context,
			},
			tags: {
				...this.globalTags,
				...options?.tags,
			},
			error: options?.error || null,
		};
	}
}
