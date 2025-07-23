import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type {
	IModalFilterTicker,
} from '../../base/modal/model';

export const useMarketCapStore = defineStore('dashboards-market-cap', () => {
	const isShowChange = ref(true);

	const isShowChart = ref(true);

	const tickerLists = ref<IModalFilterTicker[]>([]);

	const activeTickersList = computed<IModalFilterTicker[]>(() =>
		tickerLists.value.filter(item => item.isSelected),
	);

	function setTickerLists(newList: IModalFilterTicker[]) {
		tickerLists.value = newList;
	}

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
		isShowChange,
		isShowChart,

		tickerLists,
		activeTickersList,
		setTickerLists,

		resetAll,

		toggleShowChange,
		toggleShowChart,
	};
});
