import { computed, type MaybeRefOrGetter, ref, toValue, watch } from 'vue';
import type { ChartType } from '@shared/component-library';
import { format } from 'date-fns';

import { createTickerSnapshot, getDefaultChartType, getDefaultDateRange, getDefaultTimezone } from '../model';
import { useQueryChartPriceChanges, useQueryChartPriceHistory } from '../queries';
import { DateRangePreset, type DateRangeValue, type TimezoneUtcType } from '@/modules/lightweight-charts/model';
import { download } from '@/shared/lib';
import { fetchTickers, type ITickerItem } from '@/modules/ticker-selector';
import type { IndicatorType } from '@/modules/indicator';

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

	async function downloadSnapshot(chartCanvas: HTMLCanvasElement) {
		const ticker = toValue(tickerId);

		const canvas = await createTickerSnapshot(chartCanvas, ticker);

		const formattedDate = format(Date.now(), 'yyyy-MM-dd_hh:mm:ss');

		canvas.toBlob(
			(blob: Blob | null) => {
				if (blob) {
					const url = URL.createObjectURL(blob);
					download(url, `${ticker}_${formattedDate}`);
					URL.revokeObjectURL(url);
				}
			},
			'image/png',
			1,
		);
	}

	// ticker

	const currentTicker = ref<ITickerItem | null>(null);

	watch(() => toValue(tickerId), async value => {
		const [ticker] = await fetchTickers(value);

		if (ticker.canonical_ticker_id === toValue(tickerId)) {
			currentTicker.value = ticker;
		}
	});

	// indicators

	const indicators = ref<IndicatorType[]>([] as IndicatorType[]);

	return {
		currentTicker,
		dateRange,
		timezone,
		chartType,
		indicators,

		changes,
		data,
		overview,

		downloadSnapshot,

		isLoading,
		isError,
		refetch,
		resetAllChanges,
	};
}
