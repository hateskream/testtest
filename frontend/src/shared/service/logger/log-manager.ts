import type { ILoggerProvider, LogLevel, ILogContext, ILogData } from './provider-interface';

export interface ILogManagerPublic {
	error(message: string, error?: Error, context?: ILogContext): void;
	warn(message: string, context?: ILogContext): void;
	info(message: string, context?: ILogContext): void;
	debug(message: string, context?: ILogContext): void;
}

interface ILogManager extends ILogManagerPublic {
	registerProvider(provider: ILoggerProvider): void;
}

class LogManager implements ILogManager {
	private providers: ILoggerProvider[] = [];
	private defaultLevel: LogLevel = 'error';

	public registerProvider(provider: ILoggerProvider): void {
		this.providers.push(provider);
	}

	public error(message: string, error?: Error, context: ILogContext = {}): void {
		this.log({ message, error, context, level: 'error' });
	}

	public warn(message: string, context: ILogContext = {}): void {
		this.log({ message, context, level: 'warning' });
	}

	public info(message: string, context: ILogContext = {}): void {
		this.log({ message, context, level: 'info' });
	}

	public debug(message: string, context: ILogContext = {}): void {
		this.log({ message, context, level: 'debug' });
	}

	private log(errorLog: Omit<ILogData, 'timestamp'>): void {
		const fullLog: ILogData = {
			...errorLog,
			timestamp: new Date().toISOString(),
			level: errorLog.level || this.defaultLevel,
		};

		this.providers.forEach(provider => {
			switch (fullLog.level) {
				case 'error':
					provider.logError(fullLog);
					break;
				case 'warning':
					provider.logWarning?.(fullLog);
					break;
				case 'info':
					provider.logInfo?.(fullLog);
					break;
				case 'debug':
					provider.logDebug?.(fullLog);
					break;
				default:
					provider.logError(fullLog);
					break;
			}
		});
	}
}

let logManagerInstance: LogManager | undefined;

export const useLogManager = () => {
	if (!logManagerInstance) {
		logManagerInstance = new LogManager();
	}
	return logManagerInstance;
};
