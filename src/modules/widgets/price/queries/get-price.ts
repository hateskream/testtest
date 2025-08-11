import { useInfiniteQuery } from '@tanstack/vue-query';
import { computed, toValue, type Ref } from 'vue';

import { getPrice } from '../api';
import type { MarketType } from '../model';

export function useQueryPrice(
	market: Ref<MarketType>,
	pined: Ref<string[]>,
	limit: number,
) {

	return useInfiniteQuery({
		queryKey: computed(() => ['price', market.value]),
		queryFn: ({ pageParam = 0 }) =>
			getPrice({
				market: toValue(market),
				pined: toValue(pined),
				offset: pageParam,
				limit: toValue(limit),
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
