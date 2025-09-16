import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useBitcoinDominanceStore = defineStore('dashboards-bitcoin-dominance', () => {
	const isShowHistorical = ref(true);
	const isShowIndicator = ref(true);
	const isShowChart = ref(true);

	const selectedTickers = ref<string[]>(['Crypto-BTCBitcoin']);

	watch(selectedTickers, (newVal) => {
		if (newVal.length === 0) {
			selectedTickers.value = ['Crypto-BTCBitcoin'];
		}
	});

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

		selectedTickers,

		resetAll,

		toggleShowHistorical,
		toggleShowIndicator,
		toggleShowChart,
	};
});
