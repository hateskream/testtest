import { MarketType } from '@/modules/market';
import type { ActivityMetricsSentiment } from './sentiment';
import { type TickerId } from '../api';

type ActivityMetricsByMarket = {
	[MarketType.Crypto]: ICryptoActivityMetrics;
	[MarketType.Stock]: IStockActivityMetrics;
	[MarketType.Indices]: IIndexActivityMetrics;
	[MarketType.Commodities]: ICommodityActivityMetrics;
	[MarketType.Forex]: IForexActivityMetrics;
	[MarketType.Etf]: IEtfActivityMetrics;
};

export type ActivityMetrics<TMarket extends MarketType = MarketType> = ActivityMetricsByMarket[TMarket];

export interface ICryptoActivityMetrics {
	tickerId: TickerId<MarketType.Crypto>;
	marketCap: string;
	volume24h: string;
	fdv: string;
	volToMktCap24h: string;
	totalSupply: string;
	sentiment: ActivityMetricsSentiment;
}

export interface IStockActivityMetrics {
	tickerId: TickerId<MarketType.Stock>;
	marketCap: string;
	volume24h: string;
	totalReturn3m: string;
	totalReturn1y: string;
	forwardPe: string;
	sector: string;
}

export interface IIndexActivityMetrics {
	tickerId: TickerId<MarketType.Indices>;
	volume24h: string;
	sector?: string;
}

export interface ICommodityActivityMetrics {
	tickerId: TickerId<MarketType.Commodities>;
	volume24h: string;
}

export interface IForexActivityMetrics {
	tickerId: TickerId<MarketType.Forex>;
	volume24h: string;
}

export interface IEtfActivityMetrics {
	tickerId: TickerId<MarketType.Etf>;
	marketCap: string;
	avgVolume: string;
	beta: string;
	topHolding: string;
	numSectors: string;
}
