import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getCapitalMetrics } from '../api';

export function useQueryCapitalMetrics(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['capital-structure', tickerId],
		queryFn: () => getCapitalMetrics({ tickerId: toValue(tickerId) }),
	});
}
