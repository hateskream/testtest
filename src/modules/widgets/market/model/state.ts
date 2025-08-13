import type { ColumnType } from '@/modules/cell';
import { MarketType } from '@/modules/market';
import type { ITableColumn } from './column';
import type { ISort } from './sort';
import type { Filters } from './filter';
import { CRYPTO_ALL_COLUMNS, CRYPTO_FILTERS } from './crypto';

interface ITableSettings {
	column: ITableColumn[];
	sort: ISort | null;
	filters: Filters;
}

type SettingsByMarket = Partial<Record<MarketType, ITableSettings>>;

export interface IState {
	activeMarket: MarketType;
	settings: SettingsByMarket;
}

const DEFAULT_STATE: IState = {
	activeMarket: MarketType.Crypto,
	settings: {
		[MarketType.Crypto]: {
			column: CRYPTO_ALL_COLUMNS,
			sort: null,
			filters: CRYPTO_FILTERS,
		},
	},
};

export function getDefaultsState(): IState {
	return structuredClone(DEFAULT_STATE);
}

interface IColumnHydrateState {
	columnType: ColumnType;
	isShow: boolean;
	order: number;
}

interface IFilterHydrateState {
	filterType: string;
	selected: string;
}

export function hydrateFilters(filters: Filters): IFilterHydrateState[] {
	return Object
		.entries(filters)
		.map(([key, value]) => ({
			filterType: key,
			selected: value.state.selected,
		}));
}

export function rehydrateFilters(states: IFilterHydrateState[], preset: Filters): Filters {
	try {
		return Object
			.entries(preset)
			.reduce((acc, [key, value]) => ({
				...acc,
				[key]: {
					...value,
					state: {
						...value.state,
						selected: findFilter(states, key).selected,
					},
				},
			}), {});
	} catch (e) {
		// eslint-disable-next-line no-console
		console.log(e);
		return preset;
	}
}

function findFilter(states: IFilterHydrateState[], filterType: string): IFilterHydrateState {
	const state = states.find(col => col.filterType === filterType);
	if (state) {
		return state;
	}

	throw new Error(`Filter ${filterType} not found`);
}

export function hydrateColumns(columns: ITableColumn[]): IColumnHydrateState[] {
	return columns.map(item => ({
		columnType: item.columnType,
		isShow: item.isShow,
		order: item.order,
	}));
}

export function rehydrateColumns(states: IColumnHydrateState[], preset: ITableColumn[]): ITableColumn[] {
	try {
		return preset.map(item => {
			const state = findColumn(states, item.columnType);

			return {
				...item,
				order: state.order,
				isShow: state.isShow,
			};
		});
	} catch (e) {
		// eslint-disable-next-line no-console
		console.log(e);
		return preset;
	}
}

function findColumn(states: IColumnHydrateState[], columnType: ColumnType): IColumnHydrateState {
	const state = states.find(col => col.columnType === columnType);
	if (state) {
		return state;
	}

	throw new Error(`Column ${columnType} not found`);
}

