import { computed, reactive } from 'vue';

import { useQueryTension } from '../queries';

export function useFearGreed() {
	const viewState = reactive({
		isShowChart: true,
		isShowName: true,
		isShowDescription: true,
		isShowPastValues: true,
	});

	const { data, isLoading, isError } = useQueryTension();

	const dataState = computed(() => ({
		data: data.value,
		isLoading: isLoading.value,
		isError: isError.value,
	}));

	const isNotData = computed(() => !!data.value && isLoading.value);

	function toggleShowChart() {
		viewState.isShowChart = !viewState.isShowChart;
	}

	function toggleShowName() {
		viewState.isShowName = !viewState.isShowName;
	}

	function toggleShowPastValues() {
		viewState.isShowPastValues = !viewState.isShowPastValues;
	}

	function toggleShowDescription() {
		viewState.isShowDescription = !viewState.isShowDescription;
	}

	function resetAllChanges() {
		viewState.isShowChart = true;
		viewState.isShowName = true;
		viewState.isShowDescription = true;
		viewState.isShowPastValues = true;
	}

	return {
		viewState,
		dataState,
		isNotData,

		toggleShowChart,
		toggleShowName,
		toggleShowPastValues,
		toggleShowDescription,
		resetAllChanges,
	};
}
