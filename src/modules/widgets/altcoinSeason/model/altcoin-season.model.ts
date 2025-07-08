export interface IAltcoinSeason {
	period: string | IPeriodTimestamps;
	btcRank: number;
	maxRank: number;
}

export interface IPeriodTimestamps {
	startTimestamp: number;
	endTimestamp: number;
}

export interface IAltcoinSeasonRequest {
	market: string;
	period?: '30D' | '90D' | '365D' | IPeriodTimestamps;
}
