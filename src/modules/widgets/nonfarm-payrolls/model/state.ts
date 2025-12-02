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

export interface INonfarmPayrollsChange {
	value: number;
	unit: string;
	direction: 'up' | 'down';
	isPositive: boolean;
}

export interface INonfarmPayrollsPoint {
	label: string;
	history: number;
}

export interface INonfarmPayrollsResponse {
	primaryValue: string;
	primaryValueUnit: string;
	change: INonfarmPayrollsChange;
	points: INonfarmPayrollsPoint[];
}

export interface INonfarmPayrollsData {
	badge: IMetricTrendBadge;
	points: {
		time: string;
		value: number;
	}[];
}
