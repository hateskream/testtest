export type IChangeDirection = 'up' | 'down' | 'neutral';

export interface INonfarmPayrollsChange {
	value: number | null;
	unit: string;
	direction: IChangeDirection;
	isPositive: boolean;
}

export interface INonfarmPayrollsPoint {
	label: string;
	history: number;
}

export interface INonfarmPayrollsData {
	primaryValue: string;
	primaryValueUnit: string;
	change: INonfarmPayrollsChange;
	points: INonfarmPayrollsPoint[];
}
