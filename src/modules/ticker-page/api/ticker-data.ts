import { delay } from '@/shared/lib';
import { MarketType } from '@/modules/market';
import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import type { ITickerItem } from '@/modules/ticker-selector';

const IS_USE_MOCK = true;

export interface ITickerDataRequest {
	tickerId: string;
}

export interface ITickerItemExtended extends ITickerItem {
	description?: string;
}

export interface IExchange {
	title: string;
	logo_url: string;
}

export interface IDataProvider {
	title: string;
	logo_url: string;
}

export interface IPriceData {
	currency: string;
	current_price: number;
	change: number;
	change_percent: number;
	status: 'positive' | 'negative' | 'neutral';
}

export interface ITickerDataResponse {
	ticker: ITickerItemExtended;
	exchange?: IExchange;
	data_provider: IDataProvider;
	price: IPriceData;
}

export function getTickerData(req: ITickerDataRequest) {
	return IS_USE_MOCK ? getMockTickerData() : getApiTickerData(req);
}

function getApiTickerData(req: ITickerDataRequest) {
	const http = useHttpService();

	try {
		return http.get<ITickerDataResponse>('/api/v1/ticker/meta', {
			query: {
				ticker_id: req.tickerId,
			},
		});
	} catch (error) {
		const logger = useLogger();
		logger.error('Failed to get ticker info', {
			error: error as Error,
		});
	}
}

async function getMockTickerData(): Promise<ITickerDataResponse> {
	await delay(2000);

	return {
		ticker: {
			canonical_ticker_id: 'Stock-AAPL',
			market_type: MarketType.Stock,
			symbol: 'AAPL',
			name: 'Apple Inc.',
			description: 'Apple Inc. is an American multinational technology company.',
		},
		exchange: {
			title: 'NASDAQ',
			logo_url: 'https://example.com/nasdaq-logo.png',
		},
		data_provider: {
			title: 'Yahoo Finance',
			logo_url: 'https://example.com/yahoo-logo.png',
		},
		price: {
			currency: '$',
			current_price: 1.1655,
			change: 0.00134,
			change_percent: 0.12,
			status: 'positive',
		},
	};
}
