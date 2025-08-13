import { computed, ref, watch } from 'vue';

import {
	getDefaultSettings,
	getDefaultState,
	type FiltersState,
	type FiltersValues,
	type ISettings,
	type ISort,
	type IState,
	type ITableColumn,
} from '../model';
import type { MarketType } from '@/modules/market';

export function useMarket() {
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

	watch(
		() => state.value.activeMarket,
		newMarket => {
			const newSettings = state.value.settings[newMarket];
			if (!newSettings) {
				// eslint-disable-next-line no-console
				console.error('No settings for market', newMarket);
				return;
			}

			currentSettings.value = newSettings;
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
