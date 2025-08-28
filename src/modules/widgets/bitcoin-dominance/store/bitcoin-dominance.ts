import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type {
	IModalFilterTicker,
} from '../../base/modal/model';

export const useBitcoinDominanceStore = defineStore('dashboards-bitcoin-dominance', () => {
	const isShowHistorical = ref(true);
	const isShowIndicator = ref(true);
	const isShowChart = ref(true);

	const tickerLists = ref<IModalFilterTicker[]>([]);

	const activeTickersList = computed<IModalFilterTicker[]>(() =>
		tickerLists.value.filter(item => item.isSelected),
	);

	function setTickerLists(newList: IModalFilterTicker[]) {
		tickerLists.value = newList;
	}

	function toggleShowHistorical() {
		isShowHistorical.value = !isShowHistorical.value;
	}

	function toggleShowChart() {
		isShowChart.value = !isShowChart.value;
	}

	function toggleShowIndicator() {
		isShowIndicator.value = !isShowIndicator.value;
	}

	function resetAll() {
		isShowHistorical.value = true;
		isShowChart.value = true;
		isShowIndicator.value = true;
	}

	return {
		isShowHistorical,
		isShowChart,
		isShowIndicator,

		tickerLists,
		activeTickersList,
		setTickerLists,

		resetAll,

		toggleShowHistorical,
		toggleShowIndicator,
		toggleShowChart,
	};
});
