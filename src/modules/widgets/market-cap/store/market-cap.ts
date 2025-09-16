import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMarketCapStore = defineStore('dashboards-market-cap', () => {
	const isShowChange = ref(true);

	const isShowChart = ref(true);

	const selectedTickers = ref<string[]>([]);

	function toggleShowChange() {
		isShowChange.value = !isShowChange.value;
	}

	function toggleShowChart() {
		isShowChart.value = !isShowChart.value;
	}

	function resetAll() {
		isShowChange.value = true;
		isShowChart.value = true;
	}

	return {
		selectedTickers,

		isShowChange,
		isShowChart,

		resetAll,

		toggleShowChange,
		toggleShowChart,
	};
});
