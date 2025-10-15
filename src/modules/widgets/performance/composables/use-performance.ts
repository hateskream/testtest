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
	type ITicker,
	type DateRange,
	Currency,
} from '../model';
import { createStateQueries } from '@/shared/service/data-repo';
import { useQueryPerformance } from '../queries';
import { MarketType } from '@/modules/market';

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
	quoteCurrency: z.nativeEnum(Currency),
});

export const settingsByMarketSchema = z.object({
	[MarketType.Stock]: stockSettingsSchema,
	[MarketType.Forex]: forexSettingsSchema,
});

export const stateSchema = z.object({
	activeMarket: z.nativeEnum(MarketType),
	settings: settingsByMarketSchema,
});

export type StateSchemaType = z.infer<typeof stateSchema>;

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
	defaultStateType: string;
}

export function usePerformance({
	widgetId,
	isEphemeral,
	defaultStateType,
}: IOptions) {
	const {
		useStateQuery,
		useStateMutation,
		applyStateToParent,
	} = createStateQueries<IState, StateSchemaType>({
		isEphemeral,
		storageKey: '__PERFORMANCE__',
		isSaveChange: !isEphemeral,
		getDefaultState: () => getDefaultState(defaultStateType),
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: hydrate,
		rehydrateFn: rehydrate,
		urlGet: '',
		urlSet: '',
	});

	const { data: dataState } = useStateQuery();
	const { mutate } = useStateMutation();

	const state = ref<IState>(getDefaultState(defaultStateType));

	const activeMarket = computed({
		get: () => state.value.activeMarket,
		set: (val: MarketType.Stock | MarketType.Forex) => {
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
			state.value.activeMarket === MarketType.Stock
				? state.value.settings[MarketType.Stock].stock
				: undefined,
		set: (val: Stock | undefined) => {
			if (val && state.value.activeMarket === MarketType.Stock) {
				state.value.settings[MarketType.Stock].stock = val;
			}
		},
	});

	const currentDate = computed({
		get: () => {
			if (state.value.activeMarket === MarketType.Stock) {
				return state.value.settings[MarketType.Stock].periodStock;
			}
			return state.value.settings[MarketType.Forex].periodForex;
		},
		set: (val: DateRange) => {
			if (state.value.activeMarket === MarketType.Stock) {
				state.value.settings[MarketType.Stock].periodStock =
					val as DateRangeStock;
			} else {
				state.value.settings[MarketType.Forex].periodForex =
					val as DateRangeForex;
			}
		},
	});

	const currentSymbolDisplayVariant = computed({
		get: () =>
			state.value.activeMarket === MarketType.Forex
				? state.value.settings[MarketType.Forex].symbolDisplayVariant
				: undefined,
		set: (val: SymbolDisplayVariant | undefined) => {
			if (val && state.value.activeMarket === MarketType.Forex) {
				state.value.settings[MarketType.Forex].symbolDisplayVariant = val;
			}
		},
	});

	const quoteCurrency = computed({
		get: () => state.value.activeMarket === MarketType.Forex
			? state.value.settings[MarketType.Forex].quoteCurrency
			: undefined,
		set: (val: Currency) => {
			if (val && state.value.activeMarket === MarketType.Forex) {
				state.value.settings[MarketType.Forex].quoteCurrency = val;
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
		isError,
		refetch,
	} = useQueryPerformance(activeMarket, pinnedTickers, limit);

	const tickers = computed((): ITicker[] => {
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
		currentDisplayVariant,
		isCompactMode,
		currentStock,
		currentDate,
		currentSymbolDisplayVariant,
		tickers,
		quoteCurrency,

		togglePin,

		loadMore,
		resetAllChanges,
		isLoading,
		isError,
		refetch,
		applyStateToParent,
	};
}

function hydrate(data: IState): StateSchemaType {
	return {
		activeMarket: data.activeMarket,
		settings: {
			[MarketType.Stock]: data.settings[MarketType.Stock],
			[MarketType.Forex]: data.settings[MarketType.Forex],
		},
	};
}

function rehydrate(data: StateSchemaType): IState {
	return {
		activeMarket: data.activeMarket as MarketType.Forex | MarketType.Stock,
		settings: {
			[MarketType.Stock]: data.settings[MarketType.Stock],
			[MarketType.Forex]: data.settings[MarketType.Forex],
		},
	};
}
