import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue';
import { z } from 'zod';
import { notNullish } from '@vueuse/core';

import {
	filtersByMarketType,
	type FiltersValues,
	FilterType,
	filterTypeToValue,
	filterValueToDisplay,
	getDefaultsSettings,
	getDefaultsState,
	type IDisplaySettings,
	type IState,
	MarketTrendFilterValue,
	RankingAndNewFilterValue,
	SectorFilterValue,
	TimeRangeFilterValue,
} from '../model';
import { useQueryPrice } from '../queries';
import { createStateQueries } from '@/shared/service/data-repo';
import { MarketType } from '@/modules/market';

const MarketTrendFilterValueSchema = z.union([
	z.nativeEnum(MarketTrendFilterValue),
	z.literal('new'),
]);
const RankingAndNewFilterValueSchema = z.nativeEnum(RankingAndNewFilterValue);
const SectorFilterValueSchema = z.nativeEnum(SectorFilterValue);
const TimeRangeFilterValueSchema = z.nativeEnum(TimeRangeFilterValue);

const FilterValueSchema = z.union([
	MarketTrendFilterValueSchema,
	RankingAndNewFilterValueSchema,
	SectorFilterValueSchema,
	TimeRangeFilterValueSchema,
]);

const FiltersStateSchema = z.record(z.nativeEnum(FilterType), FilterValueSchema.optional());

const IDisplaySettingsSchema = z.object({
	isShowChart: z.boolean(),
	isShowPercentageChange: z.boolean(),
	isShowLogo: z.boolean(),
	isShowTicker: z.boolean(),
	isShowDescription: z.boolean(),
});

const ISettingsSchema = z.object({
	display: IDisplaySettingsSchema,
	pinned: z.array(z.string()),
	filtersState: FiltersStateSchema,
});

export const stateSchema = z.object({
	activeMarket: z.nativeEnum(MarketType),
	settings: z.object({
		[MarketType.Crypto]: ISettingsSchema,
		[MarketType.Stock]: ISettingsSchema,
		[MarketType.Forex]: ISettingsSchema,
		[MarketType.Commodities]: ISettingsSchema,
		[MarketType.Indices]: ISettingsSchema,
	}),
});

export type StateSchemaType = z.infer<typeof stateSchema>;

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
	defaultStateType: string;
	maxCountRows?: MaybeRefOrGetter<number>;
}

export function usePrice({
	widgetId,
	isEphemeral,
	defaultStateType,
	maxCountRows,
}: IOptions) {
	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType>({
		isEphemeral,
		storageKey: '__PRICE__',
		isSaveChange: !isEphemeral,
		getDefaultState: () => getDefaultsState(defaultStateType),
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: (s: StateSchemaType): IState => s,
		rehydrateFn: (s: IState): StateSchemaType => s,
		urlGet: '/api/v1/price/settings',
		urlSet: '/api/v1/price/settings',
	});

	const state = ref<IState>(getDefaultsState(defaultStateType));
	const currentSettings = ref<IDisplaySettings>(getDefaultsSettings());
	const pinnedTickers = ref<string[]>([]);

	const hasPin = maxCountRows === undefined;

	const activeMarket = computed({
		get: () => state.value.activeMarket,
		set: (val: MarketType) => {
			state.value.activeMarket = val;
		},
	});

	const filtersValues = computed((): FiltersValues =>
		filtersByMarketType[activeMarket.value]
			.reduce((acc, filter) => ({
				...acc,
				[filter]: filterTypeToValue[filter]
					.map(filterValue => filterValueToDisplay[filterValue]),
			}), {}),
	);

	const filtersState = computed({
		get() {
			return state.value.settings[state.value.activeMarket].filtersState;
		},
		set(value) {
			state.value.settings[state.value.activeMarket].filtersState = value;
		},
	});

	const limit = maxCountRows ?? 150;

	const {
		data: dataResponse,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError: fetchTickersError,
		refetch,
	} = useQueryPrice(
		activeMarket,
		filtersState,
		limit,
	);

	const {
		data: dataState,
		isLoading: isLoadingState,
	} = useStateQuery();

	const { mutate } = useStateMutation();

	const isNotData = computed(() => !!dataResponse.value && isLoading.value && !isLoadingState.value);

	const tickers = computed(() => {
		if (!dataResponse.value) {
			return [];
		}

		const allTickers = [
			...dataResponse.value.pages.flatMap(page => page?.tickers).filter(t => !!t) ?? [],
			...dataResponse.value.pages.flatMap(page => page?.pinedTickers).filter(t => !!t) ?? [],
		];

		const pinedIds = new Set(pinnedTickers.value);

		const pinedTickers = allTickers
			.filter(t => pinedIds.has(t.tickerId))
			.map(t => ({
				...t,
				isShow: true,
				isPined: true,
			}));

		const otherTickers = allTickers
			.filter(t => !pinedIds.has(t.tickerId))
			.map(t => ({
				...t,
				isShow: true,
				isPined: false,
			}));

		const sortedPinedTickers = pinnedTickers.value
			.map(id => pinedTickers.find(t => t.tickerId === id))
			.filter(t => !!t);

		const sortedTickers = [
			...sortedPinedTickers,
			...otherTickers,
		];

		// TODO: Убрать, когда бек починит limit, будет ненужным
		if (notNullish(toValue(maxCountRows)) && sortedTickers.length > (toValue(maxCountRows) || 0)) {
			return sortedTickers.slice(0, toValue(maxCountRows));
		}

		return sortedTickers;
	});

	watch(dataState, newState => {
		if (newState) {
			state.value = JSON.parse(JSON.stringify(newState));
			currentSettings.value = state.value.settings[state.value.activeMarket].display;
			pinnedTickers.value = state.value.settings[state.value.activeMarket].pinned;
		}
	}, { immediate: true });

	watch(state, newState => {
		mutate(newState);
	}, { deep: true });

	watch(() => state.value.activeMarket,
		newMarket => {
			currentSettings.value = state.value.settings[newMarket].display;
			pinnedTickers.value = state.value.settings[newMarket].pinned;
		},
	);

	watch(
		currentSettings,
		newSettings => {
			state.value.settings[state.value.activeMarket].display = { ...newSettings };
		},
	);

	function resetAllChanges() {
		state.value = getDefaultsState(defaultStateType);
	}

	async function loadMore() {
		if (hasNextPage.value && !isFetchingNextPage.value) {
			await fetchNextPage();
		}
	}

	function togglePin(tickerId: string) {
		if (pinnedTickers.value.includes(tickerId)) {
			unpin(tickerId);
		} else {
			pin(tickerId);
		}
	}

	function pin(tickerId: string) {
		const newPinnedTickers = [...pinnedTickers.value, tickerId];

		pinnedTickers.value = newPinnedTickers;

		state.value.settings[state.value.activeMarket].pinned = newPinnedTickers;
	}

	function unpin(tickerId: string) {
		const newPinnedTickers = pinnedTickers.value.filter(id => id !== tickerId);

		pinnedTickers.value = newPinnedTickers;

		state.value.settings[state.value.activeMarket].pinned = newPinnedTickers;
	}

	return {
		activeMarket,
		currentSettings,
		resetAllChanges,
		tickers,
		fetchTickersError,
		loadMore,
		isNotData,
		togglePin,
		state,
		refetch,
		filtersValues,
		filtersState,
		applyStateToParent,
		hasPin,
		tickersIsLoading: isLoading,
		hasNextPage,
	};
}
