import { computed, type MaybeRefOrGetter, ref } from 'vue';
import type { ChartType } from '@shared/component-library';

import { getDefaultChartType, getDefaultDateRange, getDefaultTimezone } from '../model';
import { useQueryChartPriceHistory } from '../queries';
import { DateRangePreset, type DateRangeValue, type TimezoneUtcType } from '@/modules/lightweight-charts/model';

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
		isLoading: dataIsLoading,
		isError: dataIsError,
		refetch: refetchData,
	} = useQueryChartPriceHistory(tickerId, dateRange);

	const {
		data: overview,
		isLoading: overviewIsLoading,
		isError: overviewIsError,
		refetch: refetchOverview,
	} = useQueryChartPriceHistory(
		tickerId,
		{ type: 'preset', preset: DateRangePreset.TenYears },
	);

	const isLoading = computed(() => dataIsLoading.value || overviewIsLoading.value);
	const isError = computed(() => dataIsError.value || overviewIsError.value);

	function refetch() {
		refetchData();
		refetchOverview();
	}

	return {
		dateRange,
		timezone,
		chartType,

		data,
		overview,
		isLoading,
		isError,
		refetch,
		resetAllChanges,
	};
}
