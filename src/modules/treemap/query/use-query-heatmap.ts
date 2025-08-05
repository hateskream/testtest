import { useQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';

import { getHeatmapCrypto, getHeatmapStock } from '../api';
import { getHeatmapForex } from '../api/get-heatmap-forex';

export function useQueryHeatmapCrypto(
	excludeTickers: MaybeRefOrGetter<string[]>,
) {
	return useQuery({
		queryKey: ['heatmap-crypto', ...toValue(excludeTickers)],
		queryFn: () => getHeatmapCrypto({
			excludeTickers: toValue(excludeTickers),
		}),
		refetchOnMount: false,
	});
}

export function useQueryHeatmapStock() {
	return useQuery({
		queryKey: ['heatmap-stock'],
		queryFn: () => getHeatmapStock(),
		refetchOnMount: false,
	});
}

export function useQueryHeatmapForex(
	timeRange: MaybeRefOrGetter<string>,
) {
	return useQuery({
		queryKey: ['heatmap-forex', toValue(timeRange)],
		queryFn: () => getHeatmapForex({ timeRange: toValue(timeRange) }),
		refetchOnMount: false,
	});
}
