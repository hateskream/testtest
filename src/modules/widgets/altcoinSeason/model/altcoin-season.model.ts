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

// Дополнительные типы для работы с модулями
export type AltcoinSeasonModuleKey = keyof IAltcoinSeasonConfig['modules'];

export interface IAltcoinSeasonModuleLabels {
	performanceRank: string;
	historicalValues: string;
	highLow: string;
	top100: string;
	chart: string;
}

// Константы для модулей
export const ALTCOIN_SEASON_MODULE_LABELS: IAltcoinSeasonModuleLabels = {
	performanceRank: 'Performance Rank',
	historicalValues: 'Historical Values',
	highLow: 'High/Low',
	top100: 'Top 100',
	chart: 'Chart',
};
