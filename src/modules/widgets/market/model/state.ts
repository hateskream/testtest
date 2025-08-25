import type { ISort, ITableColumn } from '@/modules/cell';
import { MarketType } from '@/modules/market';
import type { Filters } from './filter';
import { CRYPTO_ALL_COLUMNS, CRYPTO_FILTERS } from './crypto';
import { STOCK_ALL_COLUMNS, STOCK_FILTERS } from './stock';
import { FOREX_ALL_COLUMNS } from './forex';
import { COMMODITIES_ALL_COLUMNS, COMMODITIES_FILTERS } from './commodities';
import { INDICES_ALL_COLUMNS } from './indices';

export interface ISettings {
	column: ITableColumn[];
	sort: ISort | null;
	filters: Filters;
}

type SettingsByMarket = Record<MarketType, ISettings>;

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
		[MarketType.Stock]: {
			column: STOCK_ALL_COLUMNS,
			sort: null,
			filters: STOCK_FILTERS,
		},
		[MarketType.Forex]: {
			column: FOREX_ALL_COLUMNS,
			sort: null,
			filters: {},
		},
		[MarketType.Commodities]: {
			column: COMMODITIES_ALL_COLUMNS,
			sort: null,
			filters: COMMODITIES_FILTERS,
		},
		[MarketType.Indices]: {
			column: INDICES_ALL_COLUMNS,
			sort: null,
			filters: {},
		},
	},
};

export function getDefaultState(): IState {
	return structuredClone(DEFAULT_STATE);
}

export function getDefaultSettings(): ISettings {
	return {
		column: CRYPTO_ALL_COLUMNS,
		sort: null,
		filters: CRYPTO_FILTERS,
	};
}

interface IPreset {
	filters: Filters;
	columns: ITableColumn[];
}

type Presets = Record<MarketType, IPreset>;

export const PRESETS: Presets = {
	[MarketType.Crypto]: {
		filters: CRYPTO_FILTERS,
		columns: CRYPTO_ALL_COLUMNS,
	},
	[MarketType.Stock]: {
		filters: STOCK_FILTERS,
		columns: STOCK_ALL_COLUMNS,
	},
	[MarketType.Forex]: {
		filters: {},
		columns: FOREX_ALL_COLUMNS,
	},
	[MarketType.Commodities]: {
		filters: COMMODITIES_FILTERS,
		columns: COMMODITIES_ALL_COLUMNS,
	},
	[MarketType.Indices]: {
		filters: {},
		columns: INDICES_ALL_COLUMNS,
	},
};

export interface IFilterHydrateState {
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

