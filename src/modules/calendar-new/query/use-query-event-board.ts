import { useInfiniteQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';

import type { IEventBoardRequest } from '../model/calendar';
import { getEventBoard } from '../api/get-event-board';

const DAY_IN_SECONDS = 86400;

interface IEventBoardOptions extends IEventBoardRequest {
	limit?: {
		from?: number;
		to?: number;
	};
}

export const useInfiniteQueryEventBoard = (request: MaybeRefOrGetter<IEventBoardOptions>) => {
	return useInfiniteQuery({
		queryKey: ['event-board', 'infinite', request],
		queryFn: ({ pageParam }) => getEventBoard({
			...toValue(request),
			from: pageParam,
			to: pageParam,
		}),
		initialPageParam: toValue(request).from,
		getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
			const next = lastPageParam + DAY_IN_SECONDS;
			const limitTo = toValue(request).limit?.to;
			return limitTo != null && next > limitTo ? undefined : next;
		},
		getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
			const prev = firstPageParam - DAY_IN_SECONDS;
			const limitFrom = toValue(request).limit?.from;
			return limitFrom != null && prev < limitFrom ? undefined : prev;
		},
		select: (data) => ({
			days: data.pages.flatMap(page => page.days),
		}),
		refetchOnMount: false,
	});
};
