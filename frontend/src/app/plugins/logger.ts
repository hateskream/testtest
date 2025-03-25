import { provideLogger } from '@/shared/service/logger';

export const loggerPlugin = {
	install() {
		provideLogger();
	},
};
