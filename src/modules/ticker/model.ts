export const TickerMarket = {
	CRYPTO: 'Crypto',
	STOCK: 'Stock',
	INDEX: 'Index',
	COMMODITY: 'Commodity',
	FOREX: 'Forex',
	ETF: 'Etf',
} as const;

export type TickerMarket = typeof TickerMarket[keyof typeof TickerMarket];

type CryptoMarket = 'Crypto';
type NonCryptoMarket = Exclude<TickerMarket, CryptoMarket>;

type NonCryptoTickerId = `${NonCryptoMarket}-${string}`;
type CryptoTickerId = `${CryptoMarket}-${string}_${string}`;

export type TickerId = NonCryptoTickerId | CryptoTickerId;

const tickerMarketValues = new Set(Object.values(TickerMarket));

export function isTickerId(value: string): value is TickerId {
	const [market, tickerPayload = undefined] = value.split('-');

	if (!tickerPayload) {
		return false;
	}

	if (!tickerMarketValues.has(market as TickerMarket)) {
		return false;
	}

	if (market === TickerMarket.CRYPTO) {
		return tickerPayload.split('_').length === 2;
	}

	return true;
}

export function toTickerId(value: string): TickerId {
	if (isTickerId(value)) {
		return value;
	}

	throw new Error('Invalid tickerId');
}

export function getTickerIdMarket(value: TickerId): TickerMarket {
	return value.split('-')[0] as TickerMarket;
}
