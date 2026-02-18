export interface IUnemploymentRateChange {
	value: number | null;
	unit: string;
	direction: 'up' | 'down' | 'neutral';
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
