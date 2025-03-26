import { useConsoleLogger } from './console-logger-provider';
import { useLogManager, type ILogManagerPublic } from './log-manager';
import type { ILoggerProvider } from './provider-interface';

let logManagerInstance: ILogManagerPublic | undefined;

export function useLogger() {
	if (!logManagerInstance) {
		logManagerInstance = createLogger();
	}
	return logManagerInstance;
}

function createLogger() {
	const loggers: ILoggerProvider[] = [useConsoleLogger()];

	const logManager = useLogManager();
	loggers.forEach(logger => logManager.registerProvider(logger));

	return logManager;
}
