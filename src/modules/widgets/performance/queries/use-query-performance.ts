import { useInfiniteQuery } from '@tanstack/vue-query';
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

	return useInfiniteQuery({
		queryKey,
		queryFn,
		initialPageParam: 0,
		getNextPageParam: (lastPage) => {
			if (!lastPage) {
				return undefined;
			}

			const { total, offset } = lastPage.pagination;
			const nextOffset = offset + 10;
			return nextOffset < total ? nextOffset : undefined;
		},
	});
}
