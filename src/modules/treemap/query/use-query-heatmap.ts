import { useQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';

import { getHeatmap } from '../api';

export function useQueryHeatmap(
	market: MaybeRefOrGetter<string>,
	excludeTickers: MaybeRefOrGetter<string[]>,
) {
	return useQuery({
		queryKey: ['heatmap', market, ...toValue(excludeTickers)],
		queryFn: () => getHeatmap({
			market: toValue(market),
			excludeTickers: toValue(excludeTickers),
		}),
		refetchOnMount: false,
		enabled: !!toValue(market),
	});
}
