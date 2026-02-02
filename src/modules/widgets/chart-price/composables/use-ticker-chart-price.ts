import { type MaybeRefOrGetter, ref } from 'vue';
import type { ChartType } from '@shared/component-library';

import { getDefaultChartType, getDefaultDateRange, getDefaultTimezone } from '../model';
import { useQueryChartPriceHistory } from '../queries';
import type { DateRangeValue, TimezoneUtcType } from '@/modules/lightweight-charts/model';

export function useTickerChartPrice(tickerId: MaybeRefOrGetter<string>) {
	const dateRange = ref<DateRangeValue>(getDefaultDateRange());
	const timezone = ref<TimezoneUtcType>(getDefaultTimezone());
	const chartType = ref<ChartType>(getDefaultChartType());

	function resetAllChanges() {
		dateRange.value = getDefaultDateRange();
		timezone.value = getDefaultTimezone();
	}

	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQueryChartPriceHistory(tickerId, dateRange);

	return {
		dateRange,
		timezone,
		chartType,

		data,
		isLoading,
		isError,
		refetch,
		resetAllChanges,
	};
}
