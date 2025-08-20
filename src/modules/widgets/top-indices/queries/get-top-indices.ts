import { useInfiniteQuery } from '@tanstack/vue-query';
import { computed, toValue } from 'vue';

import { getTopIndicesCrypto } from '../api';

export function useQueryTopIndices(
	limit: number,
) {

	return useInfiniteQuery({
		queryKey: computed(() => ['top-indices']),
		queryFn: ({ pageParam = 0 }) =>
			getTopIndicesCrypto({
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
