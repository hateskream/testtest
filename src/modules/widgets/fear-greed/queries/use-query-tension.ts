import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';

import { getTension } from '../api';

export function useQueryTension(market: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['market', toValue(market)],
		queryFn: () => getTension({ market: toValue(market) }),
		placeholderData: keepPreviousData,
		refetchOnMount: false,
	});
}
