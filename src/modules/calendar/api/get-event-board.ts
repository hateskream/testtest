import {
	type IEventBoardRequestOptions,
	type IEventBoardItem,
	Impact,
	MARKET_ID_TO_ISO,
	type IEventBoardResponse,
} from '../models';
import { useLogger } from '@/shared/service/logger';
import { useHttpService } from '@/shared/service/http-service.ts';
import { createMockEventBoard } from '@/modules/calendar/api/mock';

const IS_USE_MOCK = false;

export async function getEventBoard(options: IEventBoardRequestOptions): Promise<IEventBoardItem[]> {
	const logger = useLogger();

	try {
		return sendRequest(options);
	} catch (error) {
		logger.error('Failed to get display settings heatmap', error as Error);
		throw error;
	}
}

async function sendRequest(options: IEventBoardRequestOptions) {
	const httpService = useHttpService();

	if (IS_USE_MOCK) {
		return createMockEventBoard(options);
	} else {
		return (await httpService.get<IEventBoardResponse>('/api/v1/calendar/data', {
			query: prepareRequest(options),
		})).days;
	}
}

function prepareRequest(
	options: IEventBoardRequestOptions,
): Record<string, string | number> {
	const { range, filters } = options;

	const record: Record<string, string | number> = {
		from: range.from,
		to: range.to,
	};

	if (filters.eventType.length) {
		record.categories = filters.eventType
			.map(v => v.toUpperCase())
			.join(',');
	}

	if (filters.marketId.length) {
		record.countries = filters.marketId
			.map(id => MARKET_ID_TO_ISO[id].toUpperCase())
			.join(',');
	}

	if (filters.impact.length) {
		const priority: Impact[] = [Impact.Low, Impact.Medium, Impact.High];
		const min = Math.min(
			...filters.impact.map(v => priority.indexOf(v)),
		);

		if (min >= 0) {
			record.minImpact = priority[min].toUpperCase();
		}
	}

	if (filters.watchlist.length) {
		record.tickerIDs = filters.watchlist.join(',');
	}

	return record;
}
