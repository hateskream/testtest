import { inject, provide } from 'vue';

import { useConsoleLogger } from './console-logger-provider';
import { useLogManager, type ILogManagerPublic } from './log-manager';
import type { ILoggerProvider } from './provider-interface';

const loggerKey = Symbol('logger-key');

export const provideLogger = () => {
	provide<ILogManagerPublic>(loggerKey, createLogger());
};

export const useLogger = () => {
	const logger = inject<ILogManagerPublic>(loggerKey);

	if (!logger) {
		throw new Error('Logger is not provided');
	}

	return logger;
};

function createLogger() {
	const loggers: ILoggerProvider[] = [useConsoleLogger()];

	const logManager = useLogManager();
	loggers.forEach(logger => logManager.registerProvider(logger));

	return logManager;
}
