import { useInfiniteQuery } from '@tanstack/vue-query';
import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import { getPerformance } from '../api';
import type { DateRange, Stock } from '../model';

export function useQueryPerformance(
	stock: MaybeRefOrGetter<Stock>,
	date: MaybeRefOrGetter<DateRange>,
	limit: number,
) {
	return useInfiniteQuery({
		queryKey: computed(() => {
			return ['performance', toValue(stock), toValue(date)];
		}),
		queryFn: ({ pageParam = 0 }) => getPerformance({
			stock: toValue(stock),
			date: toValue(date),
			offset: pageParam,
			limit,
		}),

		initialPageParam: 0,
		getNextPageParam: (lastPage) => {
			if (!lastPage) {
				return undefined;
			}

			const { total, offset } = lastPage.pagination;
			const nextOffset = offset + limit;
			return nextOffset < total ? nextOffset : undefined;
		},
	});
}
