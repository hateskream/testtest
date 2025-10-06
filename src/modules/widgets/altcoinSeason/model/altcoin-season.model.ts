import type { PerformanceTableRow } from '@/modules/widgets/altcoinSeason/model/performance.ts';

export interface IAltcoinSeasonModules {
	performanceRank: boolean;
	historicalValues: boolean;
	top100: boolean;
	chart: boolean;
}

export interface IAltcoinSeasonConfig {
	modules: IAltcoinSeasonModules;
	period: Period;
}

export function getDefaultConfigState() {
	return {
		period: '90D',
		market: 'BTC',
		modules: {
			performanceRank: true,
			historicalValues: true,
			top100: true,
			chart: true,
		},
	} as const;
}

export interface ITop100 {
	tickers: PerformanceTableRow[];
}

export interface IChartData {
	labels: string[];
	metrics: number[];
}

export interface IPerformanceRank {
	period: Period;
	btcRank: number;
}

export interface IPeriodTimestamps {
	startTimestamp: number;
	endTimestamp: number;
}

export type Period = '7D' | '30D' | '90D' | '1Y';
export const periods = ['7D', '30D', '90D', '1Y'] as const;

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

export const ALTCOIN_SEASON_MODULE_LABELS: IAltcoinSeasonModuleLabels = {
	performanceRank: 'Performance Rank',
	historicalValues: 'Historical Values',
	top100: 'Top 100',
	chart: 'Chart',
};
