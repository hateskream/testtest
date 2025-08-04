import { useQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';

import { getHeatmapCrypto, getHeatmapStock } from '../api';

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
