import { computed, ref } from 'vue';

import { type IAltcoinSeasonConfig, type Period } from '../model';
import type { IAltcoinSeasonRequest } from '../api';

export const useAltcoinSeasonState = () => {
	const period = ref<Period>('90D');
	const modules = ref<IAltcoinSeasonConfig['modules']>({
		performanceRank: true,
		historicalValues: true,
		top100: true,
		chart: true,
	});
	const market = ref('BTC');

	const request = computed<IAltcoinSeasonRequest>(() => ({
		market: market.value,
		period: period.value,
		modules: modules.value,
	}));

	return {
		period,
		modules,
		market,

		request,
	};
};
