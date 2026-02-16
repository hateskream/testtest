import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { usePricePerformance } from '../api';

export function useQueryPricePerformance(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['price-performance', tickerId],
		queryFn: () => usePricePerformance({ tickerId: toValue(tickerId) }),
	});
}

