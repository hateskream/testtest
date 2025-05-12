import type { ILoggerProvider, ILogData } from './provider-interface';

class ConsoleLogger implements ILoggerProvider {
	logError({ message, error, context, timestamp }: ILogData): void {
		// eslint-disable-next-line no-console
		console.error(`[${timestamp}] ERROR: ${message}`, { error, context });
	}

	logWarning({ message, context, timestamp }: ILogData): void {
		// eslint-disable-next-line no-console
		console.warn(`[${timestamp}] WARN: ${message}`, { context });
	}

	logInfo({ message, context, timestamp }: ILogData): void {
		// eslint-disable-next-line no-console
		console.info(`[${timestamp}] INFO: ${message}`, { context });
	}

	logDebug({ message, context, timestamp }: ILogData): void {
		// eslint-disable-next-line no-console
		console.debug(`[${timestamp}] DEBUG: ${message}`, { context });
	}
}

let consoleLoggerInstance: ConsoleLogger | undefined;

export const useConsoleLogger = () => {
	if (!consoleLoggerInstance) {
		consoleLoggerInstance = new ConsoleLogger();
	}
	return consoleLoggerInstance;
};
