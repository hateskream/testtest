import { useQuery } from '@tanstack/vue-query';

import type { IDailyCalendarInfo } from '@/modules/calendar';
import { getCalendarDays } from '@/modules/calendar/api';

const SETTINGS_QUERY_KEY = 'calendar-settings';

export function getStateCacheKey() {
	return [SETTINGS_QUERY_KEY];
}

export const useDailyCalendarGetState = () => {
	return useQuery<IDailyCalendarInfo[]>({
		queryKey: getStateCacheKey(),
		queryFn: () => getCalendarDays(),
		refetchOnMount: false,
	});
};
