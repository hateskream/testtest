import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { type DateYYYYMMDD, useDailyCalendarGetState } from '@/modules/calendar';

export interface IUseDailyCalendar {
	from: MaybeRefOrGetter<DateYYYYMMDD>;
	to: MaybeRefOrGetter<DateYYYYMMDD>;
}

export function useDailyCalendar(options: IUseDailyCalendar) {
	const {
		data: dailyCalendar,
		isLoading: isDailyCalendarLoading,
		...rest
	} = useDailyCalendarGetState(computed(() => ({
		from: toValue(options.from),
		to: toValue(options.to),
	})));

	return {
		dailyCalendar,
		isDailyCalendarLoading,
		...rest,
	};
}
