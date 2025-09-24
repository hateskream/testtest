import { useMutation, useQuery } from '@tanstack/vue-query';

import type { IDailyCalendarInfoResponse, IEventBoardRequestOptions, IEventBoardResponse } from '@/modules/calendar';
import { getCalendarDays, getEventBoard } from '@/modules/calendar/api';
import { queryClient } from '@/shared/service/query-client.ts';

const SETTINGS_QUERY_KEY = 'calendar-settings';

export function getStateCacheKey() {
	return [SETTINGS_QUERY_KEY];
}

export const useDailyCalendarGetState = () => {
	return useQuery<IDailyCalendarInfoResponse[]>({
		queryKey: [getStateCacheKey(), 'daily-calendar'],
		queryFn: () => getCalendarDays(),
		refetchOnMount: false,
	});
};

export const useEventBoardGetState = (options: IEventBoardRequestOptions) => {
	return useQuery<IEventBoardResponse[]>({
		queryKey: [getStateCacheKey(), 'event-board'],
		queryFn: () => getEventBoard(options),
		refetchOnMount: false,
	});
};

export const useEventBoardUpdateState = () => {
	return useMutation<IEventBoardResponse[], Error, IEventBoardRequestOptions>({
		mutationFn: (newOptions) => getEventBoard(newOptions),
		onSuccess: (data) => {
			queryClient.setQueryData([getStateCacheKey(), 'event-board'], data);
		},
	});
};
