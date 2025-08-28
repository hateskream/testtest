import { useInfiniteQuery } from '@tanstack/vue-query';
import { computed, toValue, type Ref } from 'vue';

import type { MarketType } from '@/modules/market';
import type { ISelectedFilter, ISort } from '../model';
import { useGetMarket } from '../composables/use-get-market';

export function useQueryMarket(
	market: Ref<MarketType>,
	sort: Ref<ISort | null>,
	filters: Ref<ISelectedFilter[]>,
	limit: number,
) {
	return useInfiniteQuery({
		queryKey: computed(() => ['market', market.value, sort.value, filters.value]),
		queryFn: ({ pageParam = 0 }) =>
			useGetMarket({
				market: toValue(market),
				offset: pageParam,
				limit: toValue(limit),
				sort: toValue(sort),
				filters: toValue(filters),
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
