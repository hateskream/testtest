import type { ICreateEventBoardOptions, IEventBoard } from '@/modules/calendar';
import { useLogger } from '@/shared/service/logger';
import { useHttpService } from '@/shared/service/http-service.ts';
import { createMockEventBoard } from '@/modules/calendar/api/mock';

enum DataProvider {
	Production,
	MockLocal,
	MockServer,
}

const dataProvider = DataProvider.MockLocal;

export async function getEventBoard(options: ICreateEventBoardOptions): Promise<IEventBoard[]> {
	const logger = useLogger();

	try {
		return sendRequest(dataProvider, options);
	} catch (error) {
		logger.error('Failed to get display settings heatmap', error as Error);
		throw error;
	}
}

function sendRequest<T>(type: DataProvider, options: ICreateEventBoardOptions) {
	const httpService = useHttpService();

	switch (type) {
		case DataProvider.MockLocal:
			return createMockEventBoard(options);
		case DataProvider.Production:
			return httpService.get<T>('https://gateway.planet9.uk/event-board');
		case DataProvider.MockServer:
			return httpService.get<T>('https://gateway.planet9.uk/event-board');
		default:
			return createMockEventBoard(options);
	}
}
