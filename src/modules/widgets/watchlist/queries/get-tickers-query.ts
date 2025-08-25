import { useQuery } from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { getWatchlistSections } from '../api';

export function useQueryWatchlistData(tickerIds: MaybeRefOrGetter<string[]>) {
	return useQuery({
		queryKey: computed(() => ['watchlist', toValue(tickerIds)]),
		queryFn: () => getWatchlistSections({
			tickerIds: toValue(tickerIds),
		}),
		refetchOnMount: false,
	});
}
