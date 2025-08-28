import { computed, ref, watch } from 'vue';

import {
	getDefaultSettings,
	getDefaultState,
	type FiltersState,
	type FiltersValues,
	type ISettings,
	type ISort,
	type IState,
} from '../model';
import type { MarketType } from '@/modules/market';
import { useGetState, useUpdateState } from '../queries';
import type { ITableColumn } from '@/modules/cell';

export function useMarket(widgetId: string) {
	const { data: dataState } = useGetState(widgetId);
	const { mutate } = useUpdateState(widgetId);

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

	return {
		columns,
		activeMarket,
		activeSort,
		filtersValues,
		filtersState,

		resetAllChanges,
	};
}
