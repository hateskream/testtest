import { useHttpService } from '@/shared/service/http-service.ts';
import { useLogger } from '@/shared/service/monitoring';
import type { ITickerItem } from '@/modules/ticker-selector';
import type { MarketType } from '@/modules/market';
import { decodeTickerId } from '@/modules/cell';

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
		logger.error('Failed to get tickers', {
			error: error as Error,
		});

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

/**
 * @example "Stock-TSLA" -> { symbolType: "Stock", tickerId: "TSLA" }
 * @example "Stock-ABA-B" -> { symbolType: "Stock", tickerId: "ABA-B" }
 */
export function decodeCanonicalTickerId(canonicalTickerId: string): ITickerItem {
	const ticker = decodeTickerId(canonicalTickerId);

	if (!ticker) {
		throw new Error(`Could not decode ticker "${canonicalTickerId}"`);
	}

	const [symbol, nameRaw] = ticker.tickerId.split('_');

	return {
		canonical_ticker_id: canonicalTickerId,
		market_type: ticker.symbolType.toLowerCase() as MarketType,
		symbol: symbol,
		name: nameRaw ? nameRaw.replace(/_/g, ' ') : symbol,
		logo: '',
	};
}
