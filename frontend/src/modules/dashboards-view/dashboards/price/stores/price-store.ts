import { defineStore } from 'pinia';
import { readonly, ref } from 'vue';

export const usePriceStore = defineStore('dashboards-price', () => {
	const isShowChart = ref(true);
	const isShowPercentageChange = ref(true);
	const isShowLogo = ref(true);
	const isShowTicker = ref(true);

	function setShowChart(value: boolean) {
		isShowChart.value = value;
	}

	function setShowPercentageChange(value: boolean) {
		isShowPercentageChange.value = value;
	}

	function setShowLogo(value: boolean) {
		isShowLogo.value = value;
	}

	function setShowTicker(value: boolean) {
		isShowTicker.value = value;
	}

	return {
		isShowChart: readonly(isShowChart),
		isShowPercentageChange: readonly(isShowPercentageChange),
		isShowLogo: readonly(isShowLogo),
		isShowTicker: readonly(isShowTicker),
		setShowChart,
		setShowPercentageChange,
		setShowLogo,
		setShowTicker,
	};
});
