import { type FilterCondition, FilterOperator, type IFilterOption, type IFilterPreset } from '../model/filter';

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
