import type { MarketType } from '@/modules/market';
import { useHttpService } from '@/shared/service/http-service.ts';
import { useLogger } from '@/shared/service/monitoring';
import { useFetchMock } from '@/shared/mock';
import type { ITickerCategory } from '../model';

const IS_USE_MOCK = false;

export interface ITickerPagination {
	page: number;
	page_size: number;
	total_pages: number;
}

export interface ITickerSelectorData {
	total_available: number;
	pagination: ITickerPagination;
	categories: ITickerCategory[];
}

export interface ITickerSelectorResponse {
	data: ITickerSelectorData;
}

// TODO: Бэкенд должен изначально в нижнем регистре доставлять маркеты соответствуя enum MarketType
function normalizeTickerSelectorData(
	data: ITickerSelectorData,
): ITickerSelectorData {
	return {
		...data,
		categories: data.categories.map(category => ({
			...category,
			market_type: category.market_type.toLowerCase() as MarketType,
			tickers: category.tickers.map(ticker => ({
				...ticker,
				market_type: ticker.market_type.toLowerCase() as MarketType,
			})),
		})),
	};
}

export interface ITickerSelectorRequestBody {
	markets?: MarketType[];
	allTickersByMarket?: MarketType[];
	// eslint-disable-next-line @typescript-eslint/naming-convention
	excluded_tickerIDs?: string[];
	search_query?: string;
	page?: number;
	page_size?: number;
}

// TODO: Бэкенд должен изначально в нижнем регистре принимать маркеты соответствуя enum MarketType
function normalizeTickerSelectorRequestBody(
	body: ITickerSelectorRequestBody,
): ITickerSelectorRequestBody {
	return {
		...body,
		markets: body.markets?.map(m =>
			(m.charAt(0).toUpperCase() + m.slice(1).toLowerCase()) as MarketType,
		),
		allTickersByMarket: body.allTickersByMarket?.map(m =>
			(m.charAt(0).toUpperCase() + m.slice(1).toLowerCase()) as MarketType,
		),
	};
}

export async function fetchTickerSelector(
	payload: ITickerSelectorRequestBody = {},
): Promise<ITickerSelectorData> {
	const http = useHttpService();
	const logger = useLogger();

	try {
		const normalizedPayload = normalizeTickerSelectorRequestBody(payload);

		const response = IS_USE_MOCK
			? await getTickerSelectorMock()
			: await http.post<ITickerSelectorResponse>(
				'/api/v1/ticker-selector/data', normalizedPayload as Record<string, unknown>,
			);

		return normalizeTickerSelectorData(response.data);
	} catch (error) {
		logger.error('Failed to fetch ticker-selector', { error: error as Error });
		throw error;
	}
}
async function getTickerSelectorMock() {
	const { getMock } = useFetchMock<ITickerSelectorResponse>(
		'/mock/tickers/ticker-selector-data.json',
	);

	await new Promise(resolve => setTimeout(resolve, 3000));

	return getMock();
}
