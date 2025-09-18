import { useHttpService } from '@/shared/service/http-service.ts';
import { createMockApiDays } from './mock';
import { useLogger } from '@/shared/service/logger';
import type { IDailyCalendarInfo } from '@/modules/calendar';

enum DataProvider {
	Production,
	MockLocal,
	MockServer,
}

const dataProvider = DataProvider.MockLocal;

export async function getCalendarDays(): Promise<IDailyCalendarInfo[]> {
	const logger = useLogger();

	try {
		return sendRequest(dataProvider);
	} catch (error) {
		logger.error('Failed to get display settings heatmap', error as Error);
		throw error;
	}
}

function sendRequest<T>(type: DataProvider) {
	const httpService = useHttpService();

	switch (type) {
		case DataProvider.MockLocal:
			return createMockApiDays();
		case DataProvider.Production:
			return httpService.get<T>('https://gateway.planet9.uk/с');
		case DataProvider.MockServer:
			return httpService.get<T>('https://gateway.planet9.uk/с');
		default:
			return createMockApiDays();
	}
}
