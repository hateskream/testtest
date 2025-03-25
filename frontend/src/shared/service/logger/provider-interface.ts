export interface ILogContext {
	[key: string]: unknown;
}

export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

export interface ILogData {
	message: string;
	error?: Error;
	context?: ILogContext;
	level?: LogLevel;
	timestamp: string;
}

export interface ILoggerProvider {
	logError(errorLog: ILogData): void;
	logWarning?(errorLog: ILogData): void;
	logInfo?(errorLog: ILogData): void;
	logDebug?(errorLog: ILogData): void;
}
