import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { ITickerMapped } from '../../ticker-selector';

export const useMarketCapStore = defineStore('dashboards-market-cap', () => {
	const isShowChange = ref(true);

	const isShowChart = ref(true);

	const selectedTickers = ref<ITickerMapped[]>([]);

	const selectedTickersIds = computed(() => selectedTickers.value.map(item => item.tickerId).join(',') );

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
		selectedTickersIds,

		isShowChange,
		isShowChart,

		resetAll,

		toggleShowChange,
		toggleShowChart,
	};
});
