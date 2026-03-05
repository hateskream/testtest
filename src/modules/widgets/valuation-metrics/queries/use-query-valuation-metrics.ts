import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getValuationMetrics } from '../api';

export function useQueryValuationMetrics(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['valuation-metrics', tickerId],
		queryFn: () => getValuationMetrics({ tickerId: toValue(tickerId) }),
	});
}

