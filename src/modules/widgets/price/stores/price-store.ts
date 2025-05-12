import { defineStore } from 'pinia';
import { readonly, ref } from 'vue';

export const usePriceStore = defineStore('dashboards-price', () => {
	const isShowChart = ref(true);
	const isShowPercentageChange = ref(true);
	const isShowLogo = ref(true);
	const isShowTicker = ref(true);
	const isShowDescription = ref(false);

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

	return {
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
	};
});
