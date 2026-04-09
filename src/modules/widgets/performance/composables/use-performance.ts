import { ref, type Ref, watch } from 'vue';
import { z } from 'zod';

import { createStateQueries } from '@/shared/service/data-repo';
import { MarketType } from '@/modules/market';
import {
	Currency,
	DateRangeForex,
	DateRangeStock,
	DisplayVariant,
	getDefaultState,
	type IState,
	Stock,
	SymbolDisplayVariant,
} from '../model';
import { usePerformanceState } from './use-performance-state';

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
	limit?: Ref<number>;
}

export function usePerformance({
	widgetId,
	isEphemeral,
	defaultStateType,
	limit = ref(11),
}: IOptions) {
	const state = ref<IState>(getDefaultState(defaultStateType));

	const {
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
	} = usePerformanceState({ state, defaultStateType, limit });

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

	watch(
		dataState,
		(newState) => {
			if (newState) {
				state.value = JSON.parse(JSON.stringify(newState));
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
