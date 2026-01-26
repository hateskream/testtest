import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getActivityMetrics } from '../api';

export function useQueryActivityMetrics(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['activity-metrics', tickerId],
		queryFn: () => getActivityMetrics({ tickerId: toValue(tickerId) }),
	});
}

