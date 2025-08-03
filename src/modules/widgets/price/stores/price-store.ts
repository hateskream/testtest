import { defineStore } from 'pinia';
import { computed, readonly, ref } from 'vue';

import { PRICE_STOCK_TYPES } from '../const';
import type { ICurrency } from '../model';

export interface IMarket {
	name: string;
	value: string;
}

export const usePriceStore = defineStore('dashboards-price', () => {
	const isShowChart = ref(true);
	const isShowPercentageChange = ref(true);
	const isShowLogo = ref(true);
	const isShowTicker = ref(true);
	const isShowDescription = ref(false);

	const markets = computed(()=> PRICE_STOCK_TYPES);
	const activeMarket = ref({ name:'Crypto', value:'crypto' });
	const activeCurrency = ref<ICurrency | null>(null);

	function setActiveCurrency(currency:ICurrency | null) {
		activeCurrency.value = currency;
	}

	function setActiveMarket(market:IMarket) {
		activeMarket.value = market;
	}

	function toggleShowChart() {
		isShowChart.value = !isShowChart.value;
	}

	function toggleShowPercentageChange() {
		isShowPercentageChange.value = !isShowPercentageChange.value;
	}

	function toggleShowLogo() {
		isShowLogo.value = !isShowLogo.value;
	}

	function toggleShowTicker() {
		isShowTicker.value = !isShowTicker.value;
		isShowDescription.value = !isShowDescription.value;
	}

	function toggleShowDescription() {
		isShowDescription.value = !isShowDescription.value;
		isShowTicker.value = !isShowTicker.value;
	}

	function resetAll() {
		// TODO: Implement reset all
	}

	return {
		markets,
		activeMarket,
		activeCurrency: readonly(activeCurrency),
		isShowChart: readonly(isShowChart),
		isShowPercentageChange: readonly(isShowPercentageChange),
		isShowLogo: readonly(isShowLogo),
		isShowTicker: readonly(isShowTicker),
		isShowDescription: readonly(isShowDescription),
		toggleShowChart,
		toggleShowPercentageChange,
		toggleShowLogo,
		toggleShowTicker,
		toggleShowDescription,
		setActiveMarket,
		setActiveCurrency,
		resetAll,
	};
});
