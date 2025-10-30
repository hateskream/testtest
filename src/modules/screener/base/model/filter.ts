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
