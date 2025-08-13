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

export type Filters = Record<string, { state: IFilterState; readonly values: IFilterValue[] }>;
