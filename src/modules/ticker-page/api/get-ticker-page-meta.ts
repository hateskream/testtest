import { delay } from '@/shared/lib';
import { MarketType } from '@/modules/market';
import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import type { ITickerItem } from '@/modules/ticker-selector';

const IS_USE_MOCK = false;

export interface ITickerMetaRequest {
	tickerId: string;
}

export interface ITickerItemExtended extends ITickerItem {
	description?: string;
	about?: string;
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
	current_price: string;
	currency: string;
	change_24h: string;
	change_24h_percent: string;
	status: 'positive' | 'negative' | 'neutral';
}

export interface ITickerMetaResponse {
	ticker: ITickerItemExtended;
	exchange?: IExchange;
	data_provider: IDataProvider;
	price: IPriceData;
	dominant_color: string;
}

export function getTickerPageMeta(req: ITickerMetaRequest) {
	return IS_USE_MOCK ? getMockTickerData() : getApiTickerData(req);
}

function getApiTickerData(req: ITickerMetaRequest) {
	const http = useHttpService();

	try {
		return http.get<ITickerMetaResponse>('/api/v1/header/data', {
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

async function getMockTickerData(): Promise<ITickerMetaResponse> {
	await delay(2000);

	return {
		ticker: {
			canonical_ticker_id: 'Stock-AAPL',
			market_type: MarketType.Stock,
			symbol: 'AAPL',
			name: 'Apple Inc.',
			description: 'Apple Inc. is an American multinational technology company.',
			// eslint-disable-next-line @stylistic/max-len
			about: 'Apple Inc. is an American multinational technology company that designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. Founded in 1976 by Steve Jobs, Steve Wozniak, and Ronald Wayne, Apple has grown to become one of the most valuable and influential technology companies in the world. The company is known for its innovation, design excellence, and commitment to creating products that seamlessly integrate hardware, software, and services. Apple operates through various segments including iPhone, Services, Mac, iPad, and Wearables, generating revenue from both product sales and digital services. With a global presence and a loyal customer base, Apple continues to shape the technology industry through its pioneering work in areas such as mobile computing, artificial intelligence, and sustainable manufacturing.',
			// about я добавил чисто для тестирования
			// в реальном ответе либо description либо about
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
			current_price: '187.44',
			currency: '$',
			change_24h: '2.31',
			change_24h_percent: '1.25',
			status: 'positive',
		},
		dominant_color: '#FF000018',
	};
}
