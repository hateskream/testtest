export interface IAltcoinSeasonConfig {
	modules: {
		performanceRank: boolean;
		historicalValues: boolean;
		highLow: boolean;
		performanceChart: boolean;
		chart: boolean;
	};
	period: Period;
}

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
	period: Period;
}

export type Period = '1D' | '7D' | '30D' | '90D' | '365D' | IPeriodTimestamps;
