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

interface IApiTickerMeta {
	ticker: {
		canonical_ticker_id: string;
		market_type: string;
		symbol: string;
		name: string;
		description?: string;
		about?: string;
		logo?: string;
		currency?: string;
	};
	exchange?: {
		title: string;
		logo_url: string;
	};
	data_provider: {
		title: string;
		logo_url: string;
	};
	price: {
		currency: string;
		current_price: number;
		change: number;
		change_percent: number;
		status: 'positive' | 'negative' | 'neutral';
	};
	dominant_color: string;
}

const DESCRIPTION_MAX_LENGTH = 128;
const THIN_SPACE = '\u2009';

function formatPrice(value: number): string {
	const [integer, fraction] = String(value).split('.');
	const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, THIN_SPACE);

	return fraction ? `${formatted}.${fraction}` : formatted;
}

// FIXME: Убрать после обновления бекенда
function prepareApiResponse(raw: IApiTickerMeta): ITickerMetaResponse {
	const description = raw.ticker.description ?? raw.ticker.about;
	const isLongDescription = description && description.length > DESCRIPTION_MAX_LENGTH;

	return {
		ticker: {
			canonical_ticker_id: raw.ticker.canonical_ticker_id,
			market_type: raw.ticker.market_type as ITickerItemExtended['market_type'],
			symbol: raw.ticker.symbol,
			name: raw.ticker.name,
			logo: raw.ticker.logo,
			currency: raw.ticker.currency,
			...(isLongDescription
				? { about: description }
				: { description }),
		},
		...(raw.exchange && { exchange: raw.exchange }),
		data_provider: raw.data_provider,
		price: {
			current_price: formatPrice(raw.price.current_price),
			currency: raw.price.currency,
			change_24h: String(raw.price.change),
			change_24h_percent: raw.price.change_percent.toFixed(2),
			status: raw.price.status,
		},
		dominant_color: raw.dominant_color,
	};
}

export function getTickerPageMeta(req: ITickerMetaRequest) {
	return IS_USE_MOCK ? getMockTickerData() : getApiTickerData(req);
}

async function getApiTickerData(req: ITickerMetaRequest) {
	const http = useHttpService();

	try {
		const raw = await http.get<IApiTickerMeta>('/api/v1/header/data', {
			query: {
				ticker_id: req.tickerId,
			},
		});

		return prepareApiResponse(raw);
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
