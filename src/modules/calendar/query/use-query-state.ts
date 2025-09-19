import { useMutation, useQuery } from '@tanstack/vue-query';

import type { ICreateEventBoardOptions, IDailyCalendarInfo, IEventBoard } from '@/modules/calendar';
import { getCalendarDays, getEventBoard } from '@/modules/calendar/api';
import { queryClient } from '@/shared/service/query-client.ts';

const SETTINGS_QUERY_KEY = 'calendar-settings';

export function getStateCacheKey() {
	return [SETTINGS_QUERY_KEY];
}

export const useDailyCalendarGetState = () => {
	return useQuery<IDailyCalendarInfo[]>({
		queryKey: [getStateCacheKey(), 'daily-calendar'],
		queryFn: () => getCalendarDays(),
		refetchOnMount: false,
	});
};

export const useEventBoardGetState = (options: ICreateEventBoardOptions) => {
	return useQuery<IEventBoard[]>({
		queryKey: [getStateCacheKey(), 'event-board'],
		queryFn: () => getEventBoard(options),
		refetchOnMount: false,
	});
};

export const useEventBoardUpdateState = () => {
	return useMutation<IEventBoard[], Error, ICreateEventBoardOptions>({
		mutationFn: (newOptions) => getEventBoard(newOptions),
		onSuccess: (data) => {
			queryClient.setQueryData([getStateCacheKey(), 'event-board'], data);
		},
	});
};
