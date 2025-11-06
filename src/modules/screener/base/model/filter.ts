export enum FilterOperator {
	Less = 'less',
	Greater = 'greater',
	Equal = 'equal',
	EqualOrLess = 'eless',
	EqualOrGreater = 'egreater',
	InRange = 'in_range',
	NotInRange = 'not_in_range',
	Crosses = 'crosses',
	CrossesAbove = 'crosses_above',
	CrossesBelow = 'crosses_below',
	InDayRange = 'in_day_range',
	InWeekRange = 'in_week_range',
	InMonthRange = 'in_month_range',
}

export const filterOperatorToLabel: Record<FilterOperator, string> = {
	[FilterOperator.Less]: 'Below',
	[FilterOperator.Greater]: 'Above',
	[FilterOperator.Equal]: 'Equal',
	[FilterOperator.EqualOrLess]: 'Below or equal',
	[FilterOperator.EqualOrGreater]: 'Above or equal',
	[FilterOperator.InRange]: 'Between',
	[FilterOperator.NotInRange]: 'Outside',
	[FilterOperator.Crosses]: 'Crosses',
	[FilterOperator.CrossesAbove]: 'Crosses up',
	[FilterOperator.CrossesBelow]: 'Crosses down',
	[FilterOperator.InDayRange]: 'Between days',
	[FilterOperator.InWeekRange]: 'Between weeks',
	[FilterOperator.InMonthRange]: 'Between months',
};

export const filterOperatorToSymbol: Partial<Record<FilterOperator, string>> = {
	[FilterOperator.Less]: '<',
	[FilterOperator.Greater]: '>',
	[FilterOperator.EqualOrLess]: '<=',
	[FilterOperator.EqualOrGreater]: '>=',
};

export interface IBaseFilterCondition {
	operator: FilterOperator;
	right: unknown;
}

export interface ISingleValueCondition extends IBaseFilterCondition {
	operator: Exclude<FilterOperator, FilterOperator.InRange | FilterOperator.NotInRange>;
	right: string | number;
}

export interface IRangeCondition extends IBaseFilterCondition {
	operator: FilterOperator.InRange | FilterOperator.NotInRange;
	right: (number | string)[];
}

export type FilterCondition = ISingleValueCondition | IRangeCondition;

export type FullFilterCondition = FilterCondition & {
	left: string;
};

export interface IFilterPreset {
	id: string;
	label: string;
	description?: string;
	icon?: string;
	condition: FilterCondition;
}

export enum FilterFieldType {
	CheckboxGroup = 'checkbox-group',
	Condition = 'condition',
	RadioGroup = 'radio-group',
}

export interface IBaseFilterFieldConfig {
	type: FilterFieldType;
	label: string;
	description?: string;
	operators?: FilterOperator[];
}

export interface ICheckboxGroupFieldConfig extends IBaseFilterFieldConfig {
	type: FilterFieldType.CheckboxGroup;
	options: IFilterOption[];
	searchable?: boolean;
	searchPlaceholder?: string;
}

export interface IFilterOption {
	label: string;
	description?: string;
	icon?: string;
	value: string | number;
}

export type IFilterFieldConfig = IBaseFilterFieldConfig | ICheckboxGroupFieldConfig;

export interface IFilterConfig {
	field: IFilterFieldConfig;
	presets?: IFilterPreset[];
	required?: boolean;
}

export interface IFilterState {
	selected: FilterCondition | null;
	presetId?: string;
	isManual?: boolean;
}

export type Filters = Record<string, { state: IFilterState; config: IFilterConfig }>;

export interface ISelectedFilter {
	filter: string;
	value: FilterCondition;
}

export type FiltersDefinition = Record<string, IFilterConfig>;
export type FiltersState = Record<string, IFilterState>;

type FilterPresetValue = string | number;

function createPresetId(operator: FilterOperator, values: FilterPresetValue[]) {
	return `${operator}-${values.join('-')}`;
}

export function withDescription(value: string, config: IFilterPreset) {
	return {
		...config,
		description: value,
	} as IFilterPreset;
}

export function equal(value: FilterPresetValue, label?: string): IFilterPreset {
	return {
		id: createPresetId(FilterOperator.Equal, [value]),
		label: `${label ?? value}`,
		condition: {
			operator: FilterOperator.Equal,
			right: value,
		},
	};
}

export function less(value: FilterPresetValue, label?: string): IFilterPreset {
	return {
		id: createPresetId(FilterOperator.Less, [value]),
		label: `Below ${label ?? value}`,
		condition: {
			operator: FilterOperator.Less,
			right: value,
		},
	};
}

export function equalOrLess(value: FilterPresetValue, label?: string): IFilterPreset {
	return {
		id: createPresetId(FilterOperator.EqualOrLess, [value]),
		label: `${label ?? value} and below`,
		condition: {
			operator: FilterOperator.EqualOrLess,
			right: value,
		},
	};
}

export function greater(value: FilterPresetValue, label?: string): IFilterPreset {
	return {
		id: createPresetId(FilterOperator.Greater, [value]),
		label: `Above ${label ?? value}`,
		condition: {
			operator: FilterOperator.Greater,
			right: value,
		},
	};
}

export function equalOrGreater(value: FilterPresetValue, label?: string): IFilterPreset {
	return {
		id: createPresetId(FilterOperator.EqualOrGreater, [value]),
		label: `${label ?? value} and above`,
		condition: {
			operator: FilterOperator.EqualOrGreater,
			right: value,
		},
	};
}

export function inDateRange(
	operator: FilterOperator.InRange
		| FilterOperator.InDayRange
		| FilterOperator.InWeekRange
		| FilterOperator.InMonthRange,
	values: [
		from: number,
		to: number,
	],
	label: string): IFilterPreset {
	return {
		id: createPresetId(operator, values),
		label,
		condition: {
			operator: operator,
			right: values,
		} as FilterCondition,
	};
}

export function inRange(
	values: [
		from: number,
		to: number,
	],
	labels?: [
		from: string,
		to: string,
	],
): IFilterPreset {
	return {
		id: createPresetId(FilterOperator.InRange, values),
		label: `${labels?.[0] ?? values[0]} to ${labels?.[1] ?? values[1]}`,
		condition: {
			operator: FilterOperator.InRange,
			right: values,
		},
	};
}

export function crosses(value: FilterPresetValue, label?: string): IFilterPreset {
	return {
		id: createPresetId(FilterOperator.Crosses, [value]),
		label: `Crosses ${label ?? value}`,
		condition: {
			operator: FilterOperator.Crosses,
			right: value,
		},
	};
}

export function plainOptions(values: (string | number)[]): IFilterOption[] {
	return values.map(value => {
		return {
			value: value,
			label: value,
		} as IFilterOption;
	});
}
