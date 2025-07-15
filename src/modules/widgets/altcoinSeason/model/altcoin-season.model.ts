export interface IAltcoinSeasonConfig {
	modules: {
		performanceRank: boolean;
		historicalValues: boolean;
		highLow: boolean;
		top100: boolean;
		chart: boolean;
	};
	period: Period;
}

export interface IPerformanceRank {
	period: Period;
	btcRank: number;
	maxRank: number;
}

export interface IPeriodTimestamps {
	startTimestamp: number;
	endTimestamp: number;
}

export interface IAltcoinSeasonRequest {
	market: string;
}

export type Period = '1D' | '7D' | '30D' | '90D' | '365D' | IPeriodTimestamps;
