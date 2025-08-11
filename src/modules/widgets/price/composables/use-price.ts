import { computed, ref, watch } from 'vue';

import { getDefaultsSettings, getDefaultsState, MarketType, type ISettings, type IState } from '../model';
import { useQueryPrice } from '../queries';
import { useGetState, useUpdateState } from '../queries/use-query-widget-state';

export function usePrice(widgetId: string) {
	const state = ref<IState>(getDefaultsState());
	const currentSettings = ref<ISettings>(getDefaultsSettings());
	const pinnedTickers = ref<string[]>([]);

	const activeMarket = computed({
		get: () => state.value.activeMarket,
		set: (val: MarketType) => {
			state.value.activeMarket = val;
		},
	});

	const limit = 20;

	const {
		data: dataResponse,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError: fetchTickersError,
	} = useQueryPrice(
		activeMarket,
		pinnedTickers,
		limit,
	);

	const {
		data: dataState,
		isLoading: isLoadingState,
	} = useGetState(widgetId);
	const { mutate } = useUpdateState(widgetId);

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

		return [
			...sortedPinedTickers,
			...otherTickers,
		];
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

	watch(
		() => state.value.activeMarket,
		newMarket => {
			currentSettings.value = state.value.settings[newMarket].display;
			pinnedTickers.value = state.value.settings[newMarket].pinned;
		},
	), { immediate: true };

	watch(
		currentSettings,
		newSettings => {
			state.value.settings[state.value.activeMarket].display = { ...newSettings };
		},
	);

	function resetAllChanges() {
		state.value = getDefaultsState();
	}

	function loadMore() {
		if (hasNextPage.value && !isFetchingNextPage.value) {
			fetchNextPage();
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
	};
}
