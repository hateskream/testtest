import { useHttpService } from '@/shared/service/http-service.ts';
import { useLogger } from '@/shared/service/logger';
import type { ITickerItem } from '@/modules/ticker-selector';
import type { MarketType } from '@/modules/market';

const IS_USE_MOCK = false;

export async function fetchTickers(tickers: string | string[]) {
	if (!tickers.length) {
		return [];
	}

	const http = useHttpService();
	const logger = useLogger();

	try {
		const items = IS_USE_MOCK
			? decodeCanonicalTickerIds(tickers)
			: await http.get<ITickerItem[]>('/api/v1/ticker-selector/tickers-info', {
				query: prepareRequest(tickers),
			});

		return prepareResponse(items);
	} catch (error) {
		logger.error('Failed to get tickers', error as Error);

		throw error;
	}
}

function prepareResponse(items: ITickerItem[]): ITickerItem[] {
	return items.map(item => ({
		...item,
		market_type: item.market_type.toLowerCase() as MarketType,
	}));
}

function prepareRequest(tickers: string | string[]) {
	return {
		tickers: Array.isArray(tickers)
			? tickers.join(',')
			: tickers,
	};
}

export function decodeCanonicalTickerIds(
	tickers: string | string[],
): ITickerItem[] {
	const list = Array.isArray(tickers) ? tickers : [tickers];

	return list.map(decodeCanonicalTickerId);
}

export function decodeCanonicalTickerId(
	tickerId: string,
): ITickerItem {
	const [marketRaw, rest] = tickerId.split('-');
	const [symbol, nameRaw] = rest.split('_');

	return {
		canonical_ticker_id: tickerId,
		market_type: marketRaw.toLowerCase() as MarketType,
		symbol: symbol,
		name: nameRaw ? nameRaw.replace(/_/g, ' ') : symbol,
		logo: '',
	};
}
