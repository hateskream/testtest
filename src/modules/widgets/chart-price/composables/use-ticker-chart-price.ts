import { computed, type MaybeRefOrGetter, ref } from 'vue';
import type { ChartType } from '@shared/component-library';

import { getDefaultChartType, getDefaultDateRange, getDefaultTimezone } from '../model';
import { useQueryChartPriceChanges, useQueryChartPriceHistory } from '../queries';
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
		isError: overviewHasError,
		refetch: refetchOverview,
	} = useQueryChartPriceHistory(
		tickerId,
		{ type: 'preset', preset: DateRangePreset.TenYears },
	);

	const {
		data: changes,
		refetch: refetchChanges,
	} = useQueryChartPriceChanges(tickerId);

	const isLoading = computed(() => dataIsLoading.value || overviewIsLoading.value);
	const isError = computed(() => dataIsError.value || overviewHasError.value);

	function refetch() {
		refetchData();
		refetchOverview();
		refetchChanges();
	}

	return {
		dateRange,
		timezone,
		chartType,

		changes,
		data,
		overview,

		isLoading,
		isError,
		refetch,
		resetAllChanges,
	};
}
