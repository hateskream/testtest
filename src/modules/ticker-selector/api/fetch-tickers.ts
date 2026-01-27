import { useHttpService } from '@/shared/service/http-service.ts';
import { useLogger } from '@/shared/service/logger';
import type { ITickerItem } from '@/modules/ticker-selector';
import type { MarketType } from '@/modules/market';

const IS_USE_MOCK = false;

export async function fetchTickers(tickers: string | string[]) {
	const http = useHttpService();
	const logger = useLogger();

	try {
		return IS_USE_MOCK
			? decodeCanonicalTickerIds(tickers)
			: http.get<ITickerItem[]>('/api/v1/ticker-selector/tickers-info', {
				query: prepareRequest(tickers),
			});
	} catch (error) {
		logger.error('Failed to get tickers', error as Error);

		throw error;
	}
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
