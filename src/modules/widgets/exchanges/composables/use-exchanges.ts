import { computed, ref, toValue, watch } from 'vue';
import { z } from 'zod';
import { useCloned } from '@vueuse/core';

import {
	getDefaultSettings,
	getDefaultState,
	PRESETS,
	type ISettings,
	type IState,

} from '../model';
import { MarketType } from '../model/exchanges';
import type { ITableColumn, ISort, IHydratedColumn } from '@/modules/cell';
import { createStateQueries } from '@/shared/service/data-repo';
import { ColumnType, hydrateColumns, rehydrateColumns } from '@/modules/cell';

const columnSchema = z.object({
	columnType: z.nativeEnum(ColumnType),
	isShow: z.boolean(),
	order: z.number(),
});


const settingsSchema = z.object({
	column: z.array(columnSchema),
	sort: z.object({
		columnType: z.string(),
		sortDirection: z.string(),
	}).nullish(),
});

export const stateSchema = z.object({
	activeMarket: z.nativeEnum(MarketType),
	settings: z.object({
		[MarketType.CryptoCEX]: settingsSchema,
		[MarketType.CryptoDEX]: settingsSchema,
		[MarketType.Stock]: settingsSchema,
	}),
});

export type StateSchemaType = z.infer<typeof stateSchema>;

export function useExchanges(widgetId: string) {
	const {
		useStateQuery,
		useStateMutation,
	} = createStateQueries<IState, StateSchemaType>({
		storageKey: '__EXCHANGES__',
		isSaveChange: true,
		getDefaultState: getDefaultState,
		entityId: widgetId,
		schema: stateSchema,
		hydrateFn: hydrate,
		rehydrateFn: rehydrate,
		urlGet: '',
		urlSet: '',
	});


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

	watch(dataState, newState => {
		if (newState) {
			state.value = toValue(useCloned(newState).cloned);
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

	return {
		columns,
		activeMarket,
		activeSort,
		resetAllChanges,
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
					([key, { column, sort }]) => [
						key,
						{
							column: rehydrateColumns(
								column,
								PRESETS[key as MarketType].columns,
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
							sort: value.sort,
						},
					],
				),
		) as SettingsType,
	};


	return hydrated;
}
