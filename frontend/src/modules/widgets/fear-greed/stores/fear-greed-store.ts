import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFearGreedStore = defineStore('dashboards-fear-greed', () => {
	const isShowChart = ref(true);
	const isShowName = ref(true);
	const isShowDescription = ref(true);
	const isShowPastValues = ref(true);

	function toggleShowChart() {
		isShowChart.value = !isShowChart.value;
	}

	function toggleShowName() {
		isShowName.value = !isShowName.value;
	}

	function toggleShowPastValues() {
		isShowPastValues.value = !isShowPastValues.value;
	}

	function toggleShowDescription() {
		isShowDescription.value = !isShowDescription.value;
	}

	return {
		isShowChart,
		isShowPastValues,
		isShowName,
		isShowDescription,

		toggleShowChart,
		toggleShowName,
		toggleShowPastValues,
		toggleShowDescription,
	};
});
