import { computed, ref, watch } from 'vue';

import { useQueryAltcoinSeason } from '../queries';
import { type AltcoinSeasonModuleKey, type IAltcoinSeasonConfig, type Period } from '../model';
import type { IAltcoinSeasonRequest } from '../api';

export const useAltcoinSeasonStore = () => {
	const period = ref<Period>('90D');
	const modules = ref<IAltcoinSeasonConfig['modules']>();
	const market = ref('BTC');

	const request = computed<IAltcoinSeasonRequest>(() => ({
		market: market.value,
		period: period.value,
		modules: modules.value,
	}));

	const { data, refetch, isLoading, isError } = useQueryAltcoinSeason(request);

	const widgetData = computed(() => ({
		widgetConfig: data.value?.widgetConfig,
		performanceRank: data.value?.performanceRank,
		historicalValues: data.value?.historicalValues,
		top100: data.value?.top100,
		chart: data.value?.chart,
	}));
	const selectedPeriod = computed(() => period.value);

	const setPeriod = (newPeriod: Period) => {
		period.value = newPeriod;
	};

	const handlePeriodChange = (newPeriod: Period) => {
		period.value = newPeriod;
		refetch();
	};

	const setModuleState = async (moduleKey: AltcoinSeasonModuleKey, value: boolean) => {
		modules.value![moduleKey] = value;
	};

	// Dirty hack to initialize period from widgetConfig after first fetch BUT it should work for every fetch
	watch(() => data.value?.widgetConfig?.period, (newPeriod) => {
		period.value = newPeriod as Period;
	}, { once: true });

	return {
		period,

		widgetData,
		refetch,
		isLoading,
		isError,

		setPeriod,
		handlePeriodChange,
		selectedPeriod,
		setModuleState,
	};
};
