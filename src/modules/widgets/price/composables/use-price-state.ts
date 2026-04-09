import { computed, type MaybeRefOrGetter, type Ref, toValue } from 'vue';
import { notNullish } from '@vueuse/core';

import {
	filtersByMarketType,
	type FiltersValues,
	filterTypeToValue,
	filterValueToDisplay,
	getDefaultsState,
	type IDisplaySettings,
	type IState,
} from '../model';
import { useQueryPrice } from '../queries';
import { MarketType } from '@/modules/market';

interface IOptions {
	defaultStateType: string;
	maxCountRows?: MaybeRefOrGetter<number>;
	state: Ref<IState>;
}

export function usePriceState({ defaultStateType, maxCountRows, state }: IOptions) {
	const hasPin = maxCountRows === undefined;
	const limit = maxCountRows ?? 150;

	const activeMarket = computed({
		get: () => state.value.activeMarket,
		set: (val: MarketType) => {
			state.value.activeMarket = val;
		},
	});

	const currentSettings = computed({
		get: () => state.value.settings[activeMarket.value].display,
		set: (value: IDisplaySettings) => {
			state.value.settings[activeMarket.value].display = { ...value };
		},
	});

	const pinnedTickers = computed({
		get: () => state.value.settings[activeMarket.value].pinned,
		set: (value: string[]) => {
			state.value.settings[activeMarket.value].pinned = value;
		},
	});

	const filtersValues = computed(
		(): FiltersValues =>
			filtersByMarketType[activeMarket.value].reduce(
				(acc, filter) => ({
					...acc,
					[filter]: filterTypeToValue[filter].map(
						(filterValue) => filterValueToDisplay[filterValue],
					),
				}),
				{},
			),
	);

	const filtersState = computed({
		get() {
			return state.value.settings[state.value.activeMarket].filtersState;
		},
		set(value) {
			state.value.settings[state.value.activeMarket].filtersState = value;
		},
	});

	const {
		data: priceData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError: fetchTickersError,
		refetch,
	} = useQueryPrice(activeMarket, filtersState, limit);

	const isNotData = computed(() => !!priceData.value && isLoading.value);

	const tickers = computed(() => {
		if (!priceData.value) {
			return [];
		}

		const allTickers = [
			...(priceData.value.pages
				.flatMap((page) => page?.tickers)
				.filter((t) => !!t) ?? []),
			...(priceData.value.pages
				.flatMap((page) => page?.pinedTickers)
				.filter((t) => !!t) ?? []),
		];

		const pinedIds = new Set(pinnedTickers.value);

		const pinedTickersList = allTickers
			.filter((t) => pinedIds.has(t.tickerId))
			.map((t) => ({
				...t,
				isShow: true,
				isPined: true,
			}));

		const otherTickers = allTickers
			.filter((t) => !pinedIds.has(t.tickerId))
			.map((t) => ({
				...t,
				isShow: true,
				isPined: false,
			}));

		const sortedPinedTickers = pinnedTickers.value
			.map((id) => pinedTickersList.find((t) => t.tickerId === id))
			.filter((t) => !!t);

		const sortedTickers = [...sortedPinedTickers, ...otherTickers];

		// TODO: Remove after backend fixes limit
		const rowsCount = toValue(maxCountRows);

		if (notNullish(rowsCount) && sortedTickers.length > rowsCount) {
			return sortedTickers.slice(0, rowsCount);
		}

		return sortedTickers;
	});

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
		pinnedTickers.value = [...pinnedTickers.value, tickerId];
	}

	function unpin(tickerId: string) {
		pinnedTickers.value = pinnedTickers.value.filter(id => id !== tickerId);
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
		hasPin,
		tickersIsLoading: isLoading,
		hasNextPage,
	};
}
