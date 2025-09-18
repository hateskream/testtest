import { useQuery } from '@tanstack/vue-query';

import type { ICreateEventBoardOptions, IDailyCalendarInfo, IEventBoard } from '@/modules/calendar';
import { getCalendarDays, getEventBoard } from '@/modules/calendar/api';

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
