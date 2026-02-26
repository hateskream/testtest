import { useHttpService } from '@/shared/service/http-service.ts';
import { useLogger } from '@/shared/service/monitoring';
import { useFetchMock } from '@/shared/mock';
import type { MarketType } from '@/modules/market';

const IS_USE_MOCK = false;

export interface IInitTickerSelectorCategory {
	market_type: MarketType;
	tickers_count: number;
}

export interface IInitTickerSelectorData {
	total_available: number;
	categories: IInitTickerSelectorCategory[];
}

interface IInitTickerSelectorResponse {
	data: IInitTickerSelectorData;
}

export async function initTickerSelector(): Promise<IInitTickerSelectorData> {
	const http = useHttpService();
	const logger = useLogger();

	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await http.get<IInitTickerSelectorResponse>('/api/v1/ticker-selector/init');

		return normalizeInitTickerSelectorData(response.data);
	} catch (error) {
		logger.error('Failed to init ticker-selector', { error: error as Error });
		throw error;
	}
}

async function getMockData() {
	const { getMock } = useFetchMock<IInitTickerSelectorResponse>('/mock/tickers/init-ticker-selector.json');

	await new Promise(resolve => setTimeout(resolve, 1000));

	return getMock();
}

// TODO: Бэкенд должен изначально в нижнем регистре доставлять маркеты соответствуя enum MarketType
function normalizeInitTickerSelectorData(
	data: IInitTickerSelectorData,
): IInitTickerSelectorData {
	return {
		...data,
		categories: data.categories.map(c => ({
			...c,
			market_type: c.market_type.toLowerCase() as MarketType,
		})),
	};
}
