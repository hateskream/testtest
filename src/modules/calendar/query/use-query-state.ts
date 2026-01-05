import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import type {
	IDailyCalendarInfoRequest,
	IDailyCalendarInfoResponse,
	IEventBoardRequestOptions,
	IEventBoardResponse,
} from '@/modules/calendar';
import { getCalendarDays, getEventBoard } from '@/modules/calendar/api';

const SETTINGS_QUERY_KEY = 'calendar-settings';

export const useDailyCalendarGetState = (options: MaybeRefOrGetter<IDailyCalendarInfoRequest>) => {
	return useQuery<IDailyCalendarInfoResponse[]>({
		queryKey: [SETTINGS_QUERY_KEY, 'daily-calendar', options],
		queryFn: () => getCalendarDays(toValue(options)),
		refetchOnMount: false,
	});
};

export const useEventBoardGetState = (options: MaybeRefOrGetter<IEventBoardRequestOptions>) => {
	return useQuery<IEventBoardResponse[]>({
		queryKey: [SETTINGS_QUERY_KEY, 'event-board', options],
		queryFn: () => getEventBoard(toValue(options)),
		refetchOnMount: false,
	});
};
