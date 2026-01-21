import type { TickerId } from '@/modules/ticker';

export interface IActivityMetricsRequest {
	tickerId: TickerId;
}

export type ActivityMetricsResponse =
	ICryptoActivityMetricsResponse |
	IStockActivityMetricsResponse |
	IIndexActivityMetricsResponse |
	ICommodityActivityMetricsResponse |
	IForexActivityMetricsResponse |
	IEtfActivityMetricsResponse;

export interface IBaseActivityMetricsResponse {
	ticker_id: string;
}

export interface ICryptoActivityMetricsResponse extends IBaseActivityMetricsResponse {
	market_cap: string;
	volume_24h: string;
	fdv: string;
	vol_to_mkt_cap_24h: string;
	total_supply: string;
	sentiment: string;
}

export interface IStockActivityMetricsResponse extends IBaseActivityMetricsResponse {
	market_cap: string;
	volume_24h: string;
	total_return_3m: string;
	total_return_1y: string;
	forward_pe: string;
	sector: string;
}

export interface IIndexActivityMetricsResponse extends IBaseActivityMetricsResponse {
	volume_24h: string;
	sector?: string;
}

export interface ICommodityActivityMetricsResponse extends IBaseActivityMetricsResponse {
	volume_24h: string;
}

export interface IForexActivityMetricsResponse extends IBaseActivityMetricsResponse {
	volume_24h: string;
}

export interface IEtfActivityMetricsResponse extends IBaseActivityMetricsResponse {
	market_cap: string;
	avg_volume: string;
	beta: string;
	top_holding: string;
	num_sectors: string;
}

