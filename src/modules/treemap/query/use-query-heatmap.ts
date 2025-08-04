import { useQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';

import { getHeatmapCrypto } from '../api';

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
