import { useInfiniteQuery } from '@tanstack/vue-query';
import { computed, toValue, type Ref } from 'vue';

import { type MarketType } from '../model/exchanges';
import { useGetExchanges } from '../composables/use-get-exchanges';
import { type ISort } from '@/modules/cell';


export function useQueryExchanges(
	market: Ref<MarketType>,
	sort: Ref<ISort | null>,
	limit: number,
) {


	return useInfiniteQuery({
		queryKey: computed(() => ['exchange', market.value, sort.value]),
		queryFn: ({ pageParam = 0 }) =>
			useGetExchanges({
				market: toValue(market),
				offset: pageParam,
				limit: toValue(limit),
				sort: toValue(sort),
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
