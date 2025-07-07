import { useQuery } from '@tanstack/vue-query';
import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import { getPerformance } from '../api';
import type { IGetPerformanceRequest } from '../model';

export function useQueryPerformance(args: MaybeRefOrGetter<IGetPerformanceRequest>) {
	const queryKey = computed(() => {
		const value = toValue(args);
		return ['performance', value.type, value.timeRange] as const;
	});

	const queryFn = computed(() => {
		const value = toValue(args);
		return () => getPerformance(value);
	});

	return useQuery({
		queryKey,
		queryFn,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
}
