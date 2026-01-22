import { MarketType } from '@/modules/market';
import type { ActivityMetricsSentiment } from '../model';

// TODO: Временно для типизации. Задача PLA-670 на унификацию работы с TickerId.
export type TickerId<
	T extends MarketType = MarketType,
	S extends string = string,
> = `${Capitalize<T & string>}-${S}`;

export interface IActivityMetricsRequest<TMarket extends MarketType = MarketType> {
	tickerId: TickerId<TMarket>;
}
type ActivityMetricsByMarket = {
	[MarketType.Crypto]: ICryptoActivityMetricsResponse;
	[MarketType.Stock]: IStockActivityMetricsResponse;
	[MarketType.Indices]: IIndexActivityMetricsResponse;
	[MarketType.Commodities]: ICommodityActivityMetricsResponse;
	[MarketType.Forex]: IForexActivityMetricsResponse;
	[MarketType.Etf]: IEtfActivityMetricsResponse;
};

export type ActivityMetricsResponse<TMarket extends MarketType = MarketType> = ActivityMetricsByMarket[TMarket];

export interface ICryptoActivityMetricsResponse {
	ticker_id: TickerId<MarketType.Crypto>;
	market_cap: string;
	volume_24h: string;
	fdv: string;
	vol_to_mkt_cap_24h: string;
	total_supply: string;
	sentiment: ActivityMetricsSentiment;
}

export interface IStockActivityMetricsResponse {
	ticker_id: TickerId<MarketType.Stock>;
	market_cap: string;
	volume_24h: string;
	total_return_3m: string;
	total_return_1y: string;
	forward_pe: string;
	sector: string;
}

export interface IIndexActivityMetricsResponse {
	ticker_id: TickerId<MarketType.Indices>;
	volume_24h: string;
	sector?: string;
}

export interface ICommodityActivityMetricsResponse {
	ticker_id: TickerId<MarketType.Commodities>;
	volume_24h: string;
}

export interface IForexActivityMetricsResponse {
	ticker_id: TickerId<MarketType.Forex>;
	volume_24h: string;
}

export interface IEtfActivityMetricsResponse {
	ticker_id: TickerId<MarketType.Etf>;
	market_cap: string;
	avg_volume: string;
	beta: string;
	top_holding: string;
	num_sectors: string;
}

