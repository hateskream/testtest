export interface IMetricTrendBadge {
	topValue: number;
	isTopValuePercent: boolean;
	label: string;
	value: number;
	unit: string;
	trend: 'up' | 'down';
	isGood: boolean;
	isPercent: boolean;
}

export interface IUnemploymentRateChange {
	value: number;
	unit: string;
	direction: 'up' | 'down';
	isPositive: boolean;
}

export interface IUnemploymentRatePoint {
	label: string;
	history: number;
}

export interface IUnemploymentRateResponse {
	primaryValue: string;
	primaryValueUnit: string;
	change: IUnemploymentRateChange;
	points: IUnemploymentRatePoint[];
}

export interface IUnemploymentRateData {
	badge: IMetricTrendBadge;
	points: { time: string; value: number }[];
}
