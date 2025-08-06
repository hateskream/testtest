import { computed, ref } from 'vue';

import { useQueryAltcoinSeason } from '../queries';
import type { Period } from '../model';
import type { IAltcoinSeasonRequest } from '../api';

export const useAltcoinSeasonStore = () => {
	const period = ref<Period>('90D');
	const market = ref('BTC');

	const request = computed<IAltcoinSeasonRequest>(() => ({
		market: market.value,
		period: period.value,
	}));
	const { data, refetch, isLoading, isError } = useQueryAltcoinSeason(request.value);

	const widgetData = computed(() => ({
		widgetConfig: data.value?.widgetConfig,
		performanceRank: data.value?.performanceRank,
		historicalValues: data.value?.historicalValues,
		top100: data.value?.top100,
		chart: data.value?.chart,
	}));

	const setPeriod = (newPeriod: Period) => {
		period.value = newPeriod;
	};

	return {
		widgetData,
		refetch,
		isLoading,
		isError,

		setPeriod,
	};
};
