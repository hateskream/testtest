export const FilterType = {
	List: 'list',
	DateRange: 'date-range',
} as const;

export type FilterType = (typeof FilterType)[keyof typeof FilterType];

export interface IFilterDateRange {
	value: string;
	type: typeof FilterType.DateRange;
	name: string;
}

export interface IFilterList<TValue> {
	value: TValue[];
	multiple: boolean;
	list: {
		label: string;
		value: TValue;
	}[];
	type: typeof FilterType.List;
	name: string;
}

export interface IFilterOption<T extends string | number> {
	label: string;
	value: T;
}
