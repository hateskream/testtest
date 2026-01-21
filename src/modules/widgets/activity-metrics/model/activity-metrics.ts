import type { TickerId } from '@/modules/ticker';

export const ActivityMetricsSentiment = {
	BULLISH: 'Bullish',
	BEARISH: 'Bearish',
	NEUTRAL: 'Neutral',
} as const;

export type ActivityMetricsSentiment = typeof ActivityMetricsSentiment[keyof typeof ActivityMetricsSentiment];

export type ActivityMetrics =
	ICryptoActivityMetrics |
	IStockActivityMetrics |
	IIndexActivityMetrics |
	ICommodityActivityMetrics |
	IForexActivityMetrics |
	IEtfActivityMetrics;

export interface IBaseActivityMetrics {
	tickerId: TickerId;
}

export interface ICryptoActivityMetrics extends IBaseActivityMetrics {
	marketCap: string;
	volume24h: string;
	fdv: string;
	volToMktCap24h: string;
	totalSupply: string;
	sentiment: ActivityMetricsSentiment;
}

export interface IStockActivityMetrics extends IBaseActivityMetrics {
	marketCap: string;
	volume24h: string;
	totalReturn3m: string;
	totalReturn1y: string;
	forwardPe: string;
	sector: string;
}

export interface IIndexActivityMetrics extends IBaseActivityMetrics {
	volume24h: string;
	sector?: string;
}

export interface ICommodityActivityMetrics extends IBaseActivityMetrics {
	volume24h: string;
}

export interface IForexActivityMetrics extends IBaseActivityMetrics {
	volume24h: string;
}

export interface IEtfActivityMetrics extends IBaseActivityMetrics {
	marketCap: string;
	avgVolume: string;
	beta: string;
	topHolding: string;
	numSectors: string;
}


