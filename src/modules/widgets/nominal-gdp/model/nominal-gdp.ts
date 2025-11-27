export const NOMINAL_GDP_METRIC = 'nominal';

export enum NominalGdpRange {
	FiveYears = '5Y',
	TenYears = '10Y',
	TwentyFiveYears = '25Y',
	All = 'All',
}

export interface INominalGdpHistoryPoint {
	label: string;
	history: number;
	forecast: number;
}

export interface INominalGdpHistory {
	range: NominalGdpRange;
	points: INominalGdpHistoryPoint[];
}

