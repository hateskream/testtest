import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type {
	IModalFilterTickerLists,
	IModalFilterTickerWithGroup,
} from '../../base/modal/model';

export const useMarketCapStore = defineStore('dashboards-market-cap', () => {
	const isShowDate = ref(true);

	const isShowSentiment = ref(true);

	const tickerLists = ref<IModalFilterTickerLists>({});

	const activeTickersList = computed<IModalFilterTickerWithGroup[]>(() =>
		Object.entries(tickerLists.value)
			.map(([group, arr]) => arr.map(item => ({ ...item, group })))
			.flat()
			.filter(item => item.isSelected),
	);

	function setTickerLists(newList: IModalFilterTickerLists) {
		tickerLists.value = newList;
	}

	function toggleShowDate() {
		isShowDate.value = !isShowDate.value;
	}

	function toggleShowSentiment() {
		isShowSentiment.value = !isShowSentiment.value;
	}

	function resetAll() {
		isShowDate.value = true;
		isShowSentiment.value = true;
	}

	return {
		isShowDate,
		isShowSentiment,

		tickerLists,
		activeTickersList,
		setTickerLists,

		resetAll,

		toggleShowDate,
		toggleShowSentiment,
	};
});
