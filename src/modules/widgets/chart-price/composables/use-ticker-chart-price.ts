import { type MaybeRefOrGetter, ref } from 'vue';

import { getDefaultDateRange } from '../model';
import { useQueryChartPriceHistory } from '../queries';
import type { DateRangeValue } from '@/modules/lightweight-charts/model';

export function useTickerChartPrice(tickerId: MaybeRefOrGetter<string>) {
	const dateRange = ref<DateRangeValue>(getDefaultDateRange());

	function resetAllChanges() {
		dateRange.value = getDefaultDateRange();
	}

	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQueryChartPriceHistory(tickerId, dateRange);

	return {
		dateRange,

		data,
		isLoading,
		isError,
		refetch,
		resetAllChanges,
	};
}
