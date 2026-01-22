import { type IEventBoardRequest, type IEventBoardResponse, COUNTRY_TO_ISO } from '../model/contract';
import { useLogger } from '@/shared/service/logger';
import { useHttpService } from '@/shared/service/http-service.ts';
import { getMockEventBoard } from './mock/event-board';

const IS_USE_MOCK = false;

export async function getEventBoard(request: IEventBoardRequest): Promise<IEventBoardResponse> {
	try {
		return IS_USE_MOCK ? getMockEventBoard() : getApiEventBoard(request);
	} catch (error) {
		const logger = useLogger();
		logger.error('Failed to get event board', error as Error);
		throw error;
	}
}

function getApiEventBoard(options: IEventBoardRequest) {
	const httpService = useHttpService();

	return httpService.get<IEventBoardResponse>('/api/v1/calendar/data', {
		query: prepareRequest(options),
	});
}

function prepareRequest(request: IEventBoardRequest) {
	const record: Record<keyof IEventBoardRequest, string | number | undefined> = {
		from: request.from,
		to: request.to,
		categories: request.categories?.map(v => v.toUpperCase()).join(','),
		countries: request.countries?.map(id => COUNTRY_TO_ISO[id].toUpperCase()).join(','),
		tickerIDs: request.tickerIDs?.join(','),
		minImpact: request.minImpact?.join(','),
	};

	return record;
}
