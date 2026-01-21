import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getActivityMetrics, mapActivityMetricsResponseToModel } from '../api';
import type { TickerId } from '@/modules/ticker';

export function useQueryActivityMetrics(tickerId: MaybeRefOrGetter<TickerId>) {
	return useQuery({
		queryKey: ['activity-metrics', tickerId],
		queryFn: async () => {
			const response = await getActivityMetrics({ tickerId: toValue(tickerId) });
			return mapActivityMetricsResponseToModel(response);
		},
	});
}
