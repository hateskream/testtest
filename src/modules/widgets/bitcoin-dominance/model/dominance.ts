export enum DominanceDateRange {
	Day= '1D',
	Week = '1W',
	Month = '1M',
	SixMonths = '6M',
	Year = '1Y',
	All = 'ALL',
}

export interface IDominanceHistoryPoint {
	timestamp: string;
	dominance: Record<string, number>;
}

export interface IDominanceHistory {
	range: DominanceDateRange;
	tickers: string[];
	data: IDominanceHistoryPoint[];
}

export interface IDominanceSnapshotValues {
	current: number;
	yesterday: number;
	week: number;
	year: number;
}

export interface IDominanceSnapshot {
	id: string;
	symbol: string;
	color: string;
	name: string;
	dominance: IDominanceSnapshotValues;
}
