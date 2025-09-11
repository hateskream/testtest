import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { ITickerMapped } from '../../ticker-selector';
import { SymbolType } from '@/modules/cell';

export const useBitcoinDominanceStore = defineStore('dashboards-bitcoin-dominance', () => {
	const isShowHistorical = ref(true);
	const isShowIndicator = ref(true);
	const isShowChart = ref(true);

	const selectedTickers = ref<ITickerMapped[]>([
		{
			tickerId: 'Crypto-BTCBitcoin',
			ticker: 'BTC',
			name: 'Bitcoin',
			symbolType: SymbolType.Crypto,
			srcImage: '3',
		},
	]);

	const selectedTickersIds = computed(() => selectedTickers.value.map(item => item.tickerId).join(',') );

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
		selectedTickersIds,

		resetAll,

		toggleShowHistorical,
		toggleShowIndicator,
		toggleShowChart,
	};
});
