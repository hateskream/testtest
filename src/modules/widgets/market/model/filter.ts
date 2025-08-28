import type { IconIds } from '@/shared/ui/icon';

export interface IIcon {
	color: string;
	id: IconIds;
}

export interface IFilterValue {
	name: string;
	value: string;
	icon?: IIcon;
}

export interface IFilterState {
	selected: string;
	isFlat: boolean;
}

type FilterType = string;

export type Filters = Record<FilterType, { state: IFilterState; readonly values: IFilterValue[] }>;

export type FiltersValues = Record<FilterType, IFilterValue[]>;
export type FiltersState = Record<FilterType, IFilterState>;

export interface ISelectedFilter {
	filter: FilterType;
	value: string;
}

export const NONE_SET_FILTER = 'none';

