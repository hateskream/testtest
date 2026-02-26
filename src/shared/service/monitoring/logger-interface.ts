export const LogLevel = {
	DEBUG: 'debug',
	INFO: 'info',
	WARN: 'warning',
	ERROR: 'error',
	FATAL: 'fatal',
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export interface ILogOptions {
	/** Additional context data to include in the log */
	context?: Record<string, unknown>;
	/** Error object to include in the log */
	error?: Error;
	/** Custom tags for grouping/sorting logs */
	tags?: Record<string, string>;
	/** Severity level override */
	level?: LogLevel;
}

export interface ILogger {
	debug(message: string, options?: ILogOptions): void;

	info(message: string, options?: ILogOptions): void;

	warn(message: string, options?: ILogOptions): void;

	error(message: string, options?: ILogOptions): void;

	exception(error: Error, options?: ILogOptions): void;

	setContext(context: Record<string, unknown>): void;

	setTags(tags: Record<string, string>): void;
}

