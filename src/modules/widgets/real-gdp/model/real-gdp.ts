export const REAL_GDP_METRIC = 'real';

export enum RealGdpRange {
	FiveYears = '5Y',
	TenYears = '10Y',
	TwentyFiveYears = '25Y',
	All = 'All',
}

export interface IRealGdpHistoryPoint {
	label: string;
	history: number;
}

export interface IRealGdpHistory {
	range: RealGdpRange;
	points: IRealGdpHistoryPoint[];
}

