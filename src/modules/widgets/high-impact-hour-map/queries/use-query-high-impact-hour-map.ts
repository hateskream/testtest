import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getHighImpactHourMap } from '../api';
import { type TimeZoneUTC } from './../model';

export function useQueryHighImpactHourMap(widgetId: MaybeRefOrGetter<string>, timezone: MaybeRefOrGetter<TimeZoneUTC>) {
	return useQuery({
		queryKey:  ['high-impact-hour-map', widgetId, timezone],
		queryFn: () => getHighImpactHourMap({ timezone: toValue(timezone), widgetId: toValue(widgetId) }),
	});
}

