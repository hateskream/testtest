import { computed, ref, watch } from 'vue';
import { z } from 'zod';

import {
	getDefaultSettings,
	getDefaultState,
	hydrateFilters,
	PRESETS,
	rehydrateFilters,
	type FiltersState,
	type FiltersValues,
	type IFilterHydrateState,
	type ISettings,
	type IState,
	type IWatchlistAction,
} from '../model';
import { MarketType } from '@/modules/market';
import type { ITableColumn, ISort, IHydratedColumn } from '@/modules/cell';
import { useWatchlist } from '@/modules/watchlist';
import { createStateQueries } from '@/shared/service/data-repo';
import { ColumnType, hydrateColumns, rehydrateColumns } from '@/modules/cell';

const columnSchema = z.object({
	columnType: z.nativeEnum(ColumnType),
	isShow: z.boolean(),
	order: z.number(),
});

const filterSchema = z.object({
	filterType: z.string(),
	selected: z.string(),
});

const settingsSchema = z.object({
	column: z.array(columnSchema),
	sort: z.object({
		columnType: z.string(),
		sortDirection: z.string(),
	}).nullish(),
	filters: z.array(filterSchema),
});

export const stateSchema = z.object({
	activeMarket: z.nativeEnum(MarketType),
	settings: z.object({
		[MarketType.Crypto]: settingsSchema,
		[MarketType.Stock]: settingsSchema,
		[MarketType.Forex]: settingsSchema,
		[MarketType.Commodities]: settingsSchema,
		[MarketType.Indices]: settingsSchema,
	}),
});

export type StateSchemaType = z.infer<typeof stateSchema>;

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
	defaultStateType: string;
}

export function useMarket({
	widgetId,
	isEphemeral,
}: IOptions) {
	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType>({
		isEphemeral,
		storageKey: '__MARKET__',
		isSaveChange: !isEphemeral,
		getDefaultState: getDefaultState,
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: hydrate,
		rehydrateFn: rehydrate,
		urlGet: '',
		urlSet: '',
	});

	const {
		actionableWatchlists: wachlists,
		addToWatchlist,
		removeFromWatchlist,
		addTickerInNewWatchlist,
	} = useWatchlist();

	const { data: dataState } = useStateQuery();
	const { mutate } = useStateMutation();

	const state = ref<IState>(getDefaultState());

	const currentSettings = ref<ISettings>(getDefaultSettings());

	const activeMarket = computed({
		get: () => state.value.activeMarket,
		set: (val: MarketType) => {
			state.value.activeMarket = val;
		},
	});

	const columns = computed({
		get: () => currentSettings.value.column,
		set: (val: ITableColumn[]) => {
			currentSettings.value.column = val;
		},
	});

	const activeSort = computed({
		get: () => currentSettings.value.sort,
		set: (sort: ISort | null) => {
			currentSettings.value.sort = sort;
		},
	});

	const filtersValues = computed((): FiltersValues =>
		Object
			.entries(currentSettings.value.filters)
			.reduce((acc, [key, value]) => ({
				...acc,
				[key]: value.values,
			})
			, {}),
	);

	const filtersState = computed({
		get(): FiltersState {
			return Object.entries(currentSettings.value.filters).reduce(
				(acc, [filter, filterState]) => ({
					...acc,
					[filter]: filterState.state,
				}),
				{},
			);
		},
		set(updatedState: FiltersState) {
			currentSettings.value.filters = Object
				.entries(currentSettings.value.filters)
				.reduce(
					(acc, [filter, filterState]) => ({
						...acc,
						[filter]: {
							...filterState,
							state: updatedState[filter],
						},
					}),
					{},
				);
		},
	});

	watch(dataState, newState => {
		if (newState) {
			state.value = JSON.parse(JSON.stringify(newState));
			currentSettings.value = state.value.settings[state.value.activeMarket];
		}
	}, { immediate: true });

	watch(state, newState => {
		mutate(newState);
	}, { deep: true });

	watch(
		() => state.value.activeMarket,
		newMarket => {
			currentSettings.value = state.value.settings[newMarket];
		},
	), { immediate: true };

	watch(
		currentSettings,
		newSettings => {
			state.value.settings[state.value.activeMarket] = newSettings;
		},
	);

	function resetAllChanges() {
		state.value = getDefaultState();
	}

	function handleAddToWatchlist({ watchlistId, tickerId }: IWatchlistAction) {
		addToWatchlist(watchlistId, tickerId, activeMarket.value);
	}

	function handleRemoveFromWatchlist({ watchlistId, tickerId }: IWatchlistAction) {
		removeFromWatchlist(watchlistId, tickerId);
	}

	function handleAddTickerInNewWatchlist(tickerId: string) {
		addTickerInNewWatchlist(tickerId, activeMarket.value);
	}

	return {
		columns,
		activeMarket,
		activeSort,
		filtersValues,
		filtersState,

		wachlists,

		resetAllChanges,

		handleAddToWatchlist,
		handleRemoveFromWatchlist,
		handleAddTickerInNewWatchlist,
		applyStateToParent,
	};
}

function rehydrate(
	data: StateSchemaType,
): IState {
	return {
		activeMarket: data.activeMarket,
		settings: Object.fromEntries(
			Object
				.entries(data.settings)
				.map(
					([key, { column, filters, sort }]) => [
						key,
						{
							column: rehydrateColumns(
								column,
								PRESETS[key as MarketType].columns,
							),
							filters: rehydrateFilters(
								filters,
								PRESETS[key as MarketType].filters,
							),
							sort: sort,
						},
					],
				),
		) as IState['settings'],
	};
}

function hydrate(data: IState): StateSchemaType {
	type SettingsType = {
		[key in MarketType]: {
			column: IHydratedColumn[];
			filters: IFilterHydrateState[];
			sort: ISort | null;
		};
	};

	const hydrated = {
		activeMarket: data.activeMarket,
		settings: Object.fromEntries(
			Object
				.entries(data.settings)
				.map(
					([key, value]) => [
						key,
						{
							column: hydrateColumns(value.column),
							filters: hydrateFilters(value.filters),
							sort: value.sort,
						},
					],
				),
		) as SettingsType,
	};


	return hydrated;
}
