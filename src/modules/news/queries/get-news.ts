import { useInfiniteQuery } from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { getNews } from '../api';
import type { IGetNewsRequest } from '../model';

export function useQueryNews(_req: MaybeRefOrGetter<IGetNewsRequest>) {
	const req = computed(
		() => toValue(_req),
	);

	return useInfiniteQuery({
		queryKey: [
			'news',
			() => [
				Array.from(req.value.score),
				Array.from(req.value.sentiment),
				Array.from(req.value.source),
				req.value.segment,
				req.value.selectedTickers,
				req.value.activeSort,
				req.value.locations,
			],
		],
		queryFn: ({ pageParam = 0 }) => getNews({ ...req.value, offset: pageParam }),
		initialPageParam: 0,
		getNextPageParam: (lastPage) => {
			if (!lastPage) {
				return undefined;
			}

			const { total, offset } = lastPage.pagination;
			const nextOffset = offset + req.value.limit;
			return nextOffset < total ? nextOffset : undefined;
		},
	});
}
