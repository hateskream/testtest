import { computed, ref, watch } from 'vue';

import { getDefaultsSettings, getDefaultsState, MarketType, type ISettings, type IState } from '../model';

export function usePrice() {
	const state = ref<IState>(getDefaultsState());
	const currentSettings = ref<ISettings>(getDefaultsSettings());

	const activeMarket = computed({
		get: () => state.value.activeMarket,
		set: (val: MarketType) => {
			state.value.activeMarket = val;
		},
	});

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
		state.value = getDefaultsState();
	}

	return {
		activeMarket,
		currentSettings,
		resetAllChanges,
	};
}
