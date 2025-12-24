import { useInfiniteQuery } from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { getNews } from '../api';
import type { IGetNewsRequest } from '../model';

export function useQueryNews(_req: MaybeRefOrGetter<IGetNewsRequest>, isSetMaxRows?: MaybeRefOrGetter<boolean>) {
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
				req.value.activeSort,
				req.value.locations,
				req.value.limit,
				req.value.dateTo,
				req.value.dateFrom,
			],
		],
		queryFn: ({ pageParam = 0 }) => getNews({ ...req.value, offset: pageParam }),
		initialPageParam: 0,
		getNextPageParam: (lastPage) => {
			if (!lastPage || toValue(isSetMaxRows)) {
				return undefined;
			}

			const { total, offset } = lastPage.pagination;
			const nextOffset = offset + req.value.limit;
			return nextOffset < total ? nextOffset : undefined;
		},
	});
}
