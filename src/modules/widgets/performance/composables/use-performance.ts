import { computed, ref, watch } from 'vue';
import { z } from 'zod';

import {
	type IState,
	getDefaultState,
	Stock,
	DisplayVariant,
	DateRangeForex,
	DateRangeStock,
	SymbolDisplayVariant,
	ForexMarketType,
} from '../model';
import { createStateQueries } from '@/shared/service/data-repo';
import { useQueryPerformance } from '../queries';

const baseSettingsSchema = z.object({
	displayVariant: z.nativeEnum(DisplayVariant),
	isCompactMode: z.boolean(),
	pinned: z.array(z.string()),
});

export const stockSettingsSchema = baseSettingsSchema.extend({
	stock: z.nativeEnum(Stock),
	periodStock: z.nativeEnum(DateRangeStock),
});

export const forexSettingsSchema = baseSettingsSchema.extend({
	periodForex: z.nativeEnum(DateRangeForex),
	symbolDisplayVariant: z.nativeEnum(SymbolDisplayVariant),
});

export const settingsByMarketSchema = z.object({
	[ForexMarketType.Stock]: stockSettingsSchema,
	[ForexMarketType.Forex]: forexSettingsSchema,
});

export const stateSchema = z.object({
	activeMarket: z.nativeEnum(ForexMarketType),
	settings: settingsByMarketSchema,
});

export type StateSchemaType = z.infer<typeof stateSchema>;

export function usePerformance(widgetId: string, defaultStateType: string) {
	const {
		useStateQuery,
		useStateMutation,
	} = createStateQueries<IState, StateSchemaType>({
		storageKey: '__PERFORMANCE__',
		isSaveChange: true,
		getDefaultState: () => getDefaultState(defaultStateType),
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: (s: StateSchemaType): IState => s,
		rehydrateFn: (s: IState): StateSchemaType => s,
		urlGet: '',
		urlSet: '',
	});

	const { data: dataState } = useStateQuery();
	const { mutate } = useStateMutation();

	const state = ref<IState>(getDefaultState(defaultStateType));

	const activeMarket = computed({
		get: () => state.value.activeMarket,
		set: (val: ForexMarketType) => {
			state.value.activeMarket = val;
		},
	});

	const currentSettings = computed(() => state.value.settings[state.value.activeMarket]);

	const currentDisplayVariant = computed({
		get: () => currentSettings.value.displayVariant,
		set: (val: DisplayVariant) => (currentSettings.value.displayVariant = val),
	});

	const isCompactMode = computed({
		get: () => currentSettings.value.isCompactMode,
		set: (val: boolean) => (currentSettings.value.isCompactMode = val),
	});

	const currentStock = computed({
		get: () =>
			state.value.activeMarket === ForexMarketType.Stock
				? state.value.settings[ForexMarketType.Stock].stock
				: undefined,
		set: (val: Stock | undefined) => {
			if (val && state.value.activeMarket === ForexMarketType.Stock) {
				state.value.settings[ForexMarketType.Stock].stock = val;
			}
		},
	});

	const currentDate = computed({
		get: () => {
			if (state.value.activeMarket === ForexMarketType.Stock) {
				return state.value.settings[ForexMarketType.Stock].periodStock;
			}
			return state.value.settings[ForexMarketType.Forex].periodForex;
		},
		set: (val: DateRangeStock | DateRangeForex) => {
			if (state.value.activeMarket === ForexMarketType.Stock) {
				state.value.settings[ForexMarketType.Stock].periodStock =
					val as DateRangeStock;
			} else {
				state.value.settings[ForexMarketType.Forex].periodForex =
					val as DateRangeForex;
			}
		},
	});

	const currentSymbolDisplayVariant = computed({
		get: () =>
			state.value.activeMarket === ForexMarketType.Forex
				? state.value.settings[ForexMarketType.Forex].symbolDisplayVariant
				: undefined,
		set: (val: SymbolDisplayVariant | undefined) => {
			if (val && state.value.activeMarket === ForexMarketType.Forex) {
				state.value.settings[ForexMarketType.Forex].symbolDisplayVariant = val;
			}
		},
	});

	const pinnedTickers = ref<string[]>(
		currentSettings.value.pinned || [],
	);

	watch(
		() => state.value.activeMarket,
		(newMarket) => {
			pinnedTickers.value = [...state.value.settings[newMarket].pinned];
		},
		{ immediate: true },
	);

	watch(pinnedTickers, (newPinned) => {
		state.value.settings[state.value.activeMarket].pinned = [...newPinned];
	});

	const limit = 50;
	const {
		data: dataResponse,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError: fetchTickersError,
		refetch,
	} = useQueryPerformance(activeMarket, pinnedTickers, limit);

	const isNotData = computed(
		() => !!dataResponse.value && isLoading.value && !dataState.value,
	);

	const tickers = computed(() => {
		if (!dataResponse.value) {
			return [];
		}

		const allTickers = [
			...(dataResponse.value.pages?.flatMap((p) => p?.tickers) ?? []),
			...(dataResponse.value.pages?.flatMap((p) => p?.pinedTickers) ?? []),
		].filter(Boolean);

		const pinnedSet = new Set(pinnedTickers.value);
		const pinned = allTickers
			.filter((t) => pinnedSet.has(t.tickerId))
			.map((t) => ({ ...t, isPinned: true }));

		const others = allTickers
			.filter((t) => !pinnedSet.has(t.tickerId))
			.map((t) => ({ ...t, isPinned: false }));

		const sortedPinned = pinnedTickers.value
			.map((id) => pinned.find((t) => t.tickerId === id))
			.filter(Boolean);

		return [...sortedPinned, ...others];
	});

	function togglePin(tickerId: string) {
		if (pinnedTickers.value.includes(tickerId)) {
			unpin(tickerId);
		} else {
			pin(tickerId);
		}
	}

	function pin(tickerId: string) {
		if (!pinnedTickers.value.includes(tickerId)) {
			pinnedTickers.value = [...pinnedTickers.value, tickerId];
		}
	}

	function unpin(tickerId: string) {
		pinnedTickers.value = pinnedTickers.value.filter((id) => id !== tickerId);
	}

	function loadMore() {
		if (hasNextPage.value && !isFetchingNextPage.value) {
			fetchNextPage();
		}
	}

	function resetAllChanges() {
		state.value = getDefaultState(defaultStateType);
		pinnedTickers.value =
			state.value.settings[state.value.activeMarket].pinned;
	}

	watch(
		dataState,
		(newState) => {
			if (newState) {
				state.value = JSON.parse(JSON.stringify(newState));
				pinnedTickers.value =
					state.value.settings[state.value.activeMarket].pinned;
			}
		},
		{ immediate: true },
	);

	watch(state, (newState) => mutate(newState), { deep: true });

	return {
		activeMarket,
		currentSettings,
		currentDisplayVariant,
		isCompactMode,
		currentStock,
		currentDate,
		currentSymbolDisplayVariant,
		pinnedTickers,
		tickers,
		togglePin,

		loadMore,
		resetAllChanges,
		isNotData,
		fetchTickersError,
		refetch,
		state,
	};
}
