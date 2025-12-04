export interface IYoYChange {
	value: number;
	direction: 'up' | 'down';
}

export interface IUSInflationPoint {
	label: string;
	value: number;
}

export interface IUSInflationDomain {
	current_value: number;
	yoy_change: IYoYChange;
	chart: IUSInflationPoint[];
}
