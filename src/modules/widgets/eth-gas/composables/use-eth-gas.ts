import { computed, ref, watch } from 'vue';

import { useGetSettings, useQueryEthGas, useUpdateSettings } from '../queries';
import { getDefaultViewState, type ISettings } from '../model';

export function useEthGas(widgetId: string) {
	const viewState = ref<ISettings>(getDefaultViewState());

	const { data, isLoading, isError } = useQueryEthGas();
	const {
		data: dataSettings,
		isLoading: isLoadingSettings,
	} = useGetSettings(widgetId);
	const { mutate } = useUpdateSettings(widgetId);

	const dataState = computed(() => ({
		data: data.value,
		isLoading: isLoading.value,
		isError: isError.value,
	}));

	const isNotData = computed(() => !!data.value && isLoading.value && !isLoadingSettings.value);

	watch(dataSettings, newSettings => {
		if (newSettings) {
			viewState.value = { ...newSettings };
		}

	}, { immediate: true });

	watch(viewState, newSettings => {
		mutate(newSettings);
	}, { deep: true });

	function resetAllChanges() {
		viewState.value = getDefaultViewState();
	}

	return {
		viewState,
		dataState,
		isNotData,
		resetAllChanges,
	};
}
