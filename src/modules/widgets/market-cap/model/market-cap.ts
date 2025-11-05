export enum MarketCapDateRange {
	Day= '1D',
	Week = '1W',
	Month = '1M',
	SixMonths = '6M',
	Year = '1Y',
	All = 'ALL',
}


export interface IMarketCapTicker {
	id: string;
	name: string;
	symbol: string;
	change24h: number;
	color: string;
	marketCap: string;
	type: 'stock' | 'crypto';
}

export interface IMarketCapTickerHistory {
	prices: [number, number][];
	market_caps: [number, number][];
	volumes: [number, number][];
}

export interface IMarketCapHistory {
	tickers: IMarketCapTicker[];
	data: Record<string, IMarketCapTickerHistory>;
}

export interface IMarketCapSummary {
	marketCap: string;
	volume: string;
	change24h: number;
}
