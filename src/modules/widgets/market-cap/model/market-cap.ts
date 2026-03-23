import { MarketType } from '@/modules/market';
import type { DateRangePresetType } from '@/modules/charts/common/model';

export type MarketCapType = MarketType.Crypto | MarketType.Stock;

export interface IMarketCapTicker {
	id: string;
	symbol: string;
	color: string;
}

export interface IMarketCapMarket {
	id: string;
	color: string;
}

export interface IMarketCapPoint<Time extends string | number = number> {
	timestamp: Time;
	marketCap: Record<string, number>;
	volume: Record<string, number>;
}

export interface IMarketCapTotal {
	marketCap: Record<string, number>;
	volume: Record<string, number>;
	changePercent: Record<string, number>;
}

export interface IMarketCapTotalValue {
	marketCap: number;
	volume: number;
	changePercent: number;
}

export interface IMarketCapHistory {
	tickers: IMarketCapTicker[];
	markets: IMarketCapMarket[];
	// TODO: Перейти на from/to
	range: DateRangePresetType;
	data: {
		points: IMarketCapPoint[];
		total: IMarketCapTotal;
	};
}
