import { useHttpService } from '@/shared/service/http-service.ts';
import { createMockApiDays } from './mock';
import { useLogger } from '@/shared/service/monitoring';
import type { IDailyCalendarInfoRequest, IDailyCalendarInfoResponse } from '@/modules/calendar';

enum DataProvider {
	Production,
	MockLocal,
	MockServer,
}

const dataProvider = DataProvider.MockLocal;

export async function getCalendarDays(options: IDailyCalendarInfoRequest): Promise<IDailyCalendarInfoResponse[]> {
	const logger = useLogger();

	try {
		return sendRequest(dataProvider, options);
	} catch (error) {
		logger.error('Failed to get display settings heatmap', { error: error as Error });
		throw error;
	}
}

function sendRequest<T>(type: DataProvider, options: IDailyCalendarInfoRequest) {
	const httpService = useHttpService();

	switch (type) {
		case DataProvider.MockLocal:
			return createMockApiDays(options);
		case DataProvider.Production:
			return httpService.get<T>('https://gateway.planet9.uk/с');
		case DataProvider.MockServer:
			return httpService.get<T>('https://gateway.planet9.uk/с');
		default:
			return createMockApiDays(options);
	}
}
