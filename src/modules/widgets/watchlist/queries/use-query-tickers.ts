import { useQuery } from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { getTickers } from '../api';

export function useQueryTickers(tickerIds: MaybeRefOrGetter<string[]>) {
	return useQuery({
		queryKey: computed(() => ['watchlist', toValue(tickerIds)]),
		queryFn: () => getTickers({
			tickerIds: toValue(tickerIds),
		}),
		refetchOnMount: false,
	});
}
