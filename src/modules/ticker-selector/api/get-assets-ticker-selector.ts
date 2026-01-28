import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import { mapTickersToTableRows, SymbolType } from '@/modules/cell';
import type { TickerDto, TickerRow } from '../model';
import { generateRows } from '@/shared/mock';

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
		if (IS_USE_MOCK) {
			return await getMockData();
		}

		const response = await httpService.get<IGetResponse>('/api/ticker-selector');

		return {
			tickers: mapTickersToTableRows<TickerRow>(response.data.tickers),
		};
	} catch (error) {
		logger.error('Failed to get ticker-selector', { error: error as Error });
		throw error;
	}
}

async function getMockData(): Promise<IPreparedResponse> {
	const [crypto, commodities, forex, indices, stocks] = await Promise.all([
		generateRows<TickerRow>(SymbolType.Crypto, [], 20),
		generateRows<TickerRow>(SymbolType.Commodity, [], 20),
		generateRows<TickerRow>(SymbolType.Forex, [], 20),
		generateRows<TickerRow>(SymbolType.Index, [], 20),
		generateRows<TickerRow>(SymbolType.Stock, [], 20),
	]);

	const mockTickers = [
		...crypto,
		...commodities,
		...forex,
		...indices,
		...stocks,
	];

	return {
		tickers: mockTickers,
	};
}
