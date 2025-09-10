import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import {
	mapTickersToTableRows,
} from '@/modules/cell';
import { mockTickers } from './mock';
import type { TickerDto, TickerRow } from '../model';

const IS_USE_MOCK = true;

interface IGetResponse {
	data: {
		tickers: TickerDto[];
	};
}

export interface IPreparedResponse {
	tickers: TickerRow[];
}

export async function getAssetsTickerSelector(): Promise<IPreparedResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await httpService.get<IGetResponse>('/api/ticker-selector');

		return {
			tickers: mapTickersToTableRows<TickerRow>(response.data.tickers),
		};
	} catch (error) {
		logger.error('Failed to get ticker-selector', error as Error);
		throw error;
	}
}


async function getMockData(): Promise<IGetResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	return {
		data:{
			tickers: mockTickers,
		},
	};
}
