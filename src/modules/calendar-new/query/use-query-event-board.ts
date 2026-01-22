import { useInfiniteQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';

import type { IEventBoardRequest } from '../model/contract';
import { getEventBoard } from '../api/get-event-board';

const DAY_IN_SECONDS = 86400;

export const useInfiniteQueryEventBoard = (request: MaybeRefOrGetter<IEventBoardRequest>) => {
	return useInfiniteQuery({
		queryKey: ['event-board', 'infinite', request],
		queryFn: ({ pageParam }) => getEventBoard({
			...toValue(request),
			from: pageParam,
			to: pageParam,
		}),
		initialPageParam: toValue(request).from,
		getNextPageParam: (_lastPage, _allPages, lastPageParam) => lastPageParam + DAY_IN_SECONDS,
		getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam - DAY_IN_SECONDS,
		select: (data) => ({
			days: data.pages.flatMap(page => page.days),
		}),
		refetchOnMount: false,
	});
};
