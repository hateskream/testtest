import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getPricePerformance } from '../api';

export function useQueryPricePerformance(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['price-performance', tickerId],
		queryFn: () => getPricePerformance({ tickerId: toValue(tickerId) }),
	});
}

