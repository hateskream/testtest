import type { ISort, ITableColumn } from '@/modules/cell';
import { STOCK_ALL_COLUMNS, STOCK_FILTERS } from '../../stock';
import { ScreenerType } from './screener-type';
import type { FilterCondition, Filters } from './filter';
import { ScreenerMarket } from './market';

export interface IState {
	activeScreenerType: ScreenerType;
	settings: SettingsByMarket;
}

export function getDefaultState(defaultStateType: ScreenerType = ScreenerType.Crypto): IState {
	return {
		activeScreenerType: defaultStateType,
		settings: {
			[ScreenerType.Stock]: {
				column: STOCK_ALL_COLUMNS,
				sort: null,
				filters: STOCK_FILTERS,
				markets: getDefaultMarkets(ScreenerType.Stock),
			},
			[ScreenerType.Crypto]: {
				column: STOCK_ALL_COLUMNS,
				sort: null,
				filters: STOCK_FILTERS,
				markets: getDefaultMarkets(ScreenerType.Crypto),
			},
			[ScreenerType.CEX]: {
				column: STOCK_ALL_COLUMNS,
				sort: null,
				filters: STOCK_FILTERS,
				markets: getDefaultMarkets(ScreenerType.CEX),
			},
			[ScreenerType.DEX]: {
				column: STOCK_ALL_COLUMNS,
				sort: null,
				filters: STOCK_FILTERS,
				markets: getDefaultMarkets(ScreenerType.DEX),
			},
			[ScreenerType.ETF]: {
				column: STOCK_ALL_COLUMNS,
				sort: null,
				filters: STOCK_FILTERS,
				markets: getDefaultMarkets(ScreenerType.ETF),
			},
			[ScreenerType.Bond]: {
				column: STOCK_ALL_COLUMNS,
				sort: null,
				filters: STOCK_FILTERS,
				markets: getDefaultMarkets(ScreenerType.Bond),
			},
		},
	};
}

export interface ISettings {
	column: ITableColumn[];
	sort: ISort | null;
	filters: Filters;
	markets: (ScreenerMarket | ScreenerType)[];
}

type SettingsByMarket = Record<ScreenerType, ISettings>;

// TODO: Добавить settings для других рынков
export function getDefaultSettings(screenerType: ScreenerType): ISettings {
	return {
		column: STOCK_ALL_COLUMNS,
		sort: null,
		filters: STOCK_FILTERS,
		markets: getDefaultMarkets(screenerType),
	};
}

function getDefaultMarkets(screenerType: ScreenerType): (ScreenerMarket | ScreenerType)[] {
	switch (screenerType) {
		case ScreenerType.Bond:
			return [ScreenerType.Bond];
		case ScreenerType.Stock:
		case ScreenerType.ETF:
			return [ScreenerMarket.USA];
		case ScreenerType.Crypto:
			return [ScreenerType.Crypto];
		case ScreenerType.CEX:
			return [ScreenerType.Crypto];
		case ScreenerType.DEX:
			return [ScreenerType.Crypto];
	}
}

interface IPreset {
	filters: Filters;
	columns: ITableColumn[];
}

type Presets = Record<ScreenerType, IPreset>;

export const PRESETS: Presets = {
	[ScreenerType.Stock]: {
		filters: STOCK_FILTERS,
		columns: STOCK_ALL_COLUMNS,
	},
	[ScreenerType.Crypto]: {
		filters: STOCK_FILTERS,
		columns: STOCK_ALL_COLUMNS,
	},
	[ScreenerType.CEX]: {
		filters: STOCK_FILTERS,
		columns: STOCK_ALL_COLUMNS,
	},
	[ScreenerType.DEX]: {
		filters: STOCK_FILTERS,
		columns: STOCK_ALL_COLUMNS,
	},
	[ScreenerType.ETF]: {
		filters: STOCK_FILTERS,
		columns: STOCK_ALL_COLUMNS,
	},
	[ScreenerType.Bond]: {
		filters: STOCK_FILTERS,
		columns: STOCK_ALL_COLUMNS,
	},
};

export interface IFilterHydrateState {
	filterType: string;
	selected: FilterCondition | null;
	presetId?: string;
}

export function hydrateFilters(filters: Filters): IFilterHydrateState[] {
	return Object
		.entries(filters)
		.map(([key, value]) => ({
			filterType: key,
			selected: value.state.selected,
			presetId: value.state.presetId,
		}));
}

export function rehydrateFilters(states: IFilterHydrateState[], preset: Filters): Filters {
	return Object
		.entries(preset)
		.reduce((acc, [key, value]) => {
			const filter = findFilter(states, key);

			if (filter) {
				acc[key] = {
					config: value.config,
					state: {
						...value.state,
						selected: filter.selected,
						presetId: filter.presetId,
					},
				};
			}

			return acc;
		}, {} as Partial<Filters>) as Filters;
}

function findFilter(states: IFilterHydrateState[], filterType: string): IFilterHydrateState | undefined {
	return states.find(col => col.filterType === filterType);
}
