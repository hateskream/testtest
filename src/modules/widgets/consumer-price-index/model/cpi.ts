export enum CpiRange {
	Year = '1Y',
	ThreeYears = '3Y',
	FiveYears = '5Y',
	TenYears = '10Y',
	All = 'All',
}

export enum CpiValueType {
	Points = 'points',
	ChangeDelta = 'change-delta',
	ChangePercent = 'change-percent',
}

export interface ICpiHistoryPoint {
	label: string;
	history: number;
}

export interface ICpiHistory {
	range: CpiRange;
	growth_yoy: number;
	points: ICpiHistoryPoint[];
}

