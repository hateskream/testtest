export interface IAltcoinSeasonConfig {
	modules: {
		performanceRank: boolean;
		historicalValues: boolean;
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

export type Period = '7D' | '30D' | '90D' | '1Y';
export const periods = ['7D', '30D', '90D', '1Y'] satisfies Period[];

// Дополнительные типы для работы с модулями
export type AltcoinSeasonModuleKey = keyof IAltcoinSeasonConfig['modules'];

export interface IAltcoinSeasonModuleLabels {
	performanceRank: string;
	historicalValues: string;
	top100: string;
	chart: string;
}

export interface IHistoricalValue {
	today: number;
	lastWeek: number;
	lastMonth: number;
}


// Константы для модулей
export const ALTCOIN_SEASON_MODULE_LABELS: IAltcoinSeasonModuleLabels = {
	performanceRank: 'Performance Rank',
	historicalValues: 'Historical Values',
	top100: 'Top 100',
	chart: 'Chart',
};
