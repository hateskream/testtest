import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getHighImpactHourMap } from '../api';
import type { TimezoneUtcType } from '@/modules/charts/common/model';

export function useQueryHighImpactHourMap(
	widgetId: MaybeRefOrGetter<string>,
	timezone: MaybeRefOrGetter<TimezoneUtcType>,
) {
	return useQuery({
		queryKey:  ['high-impact-hour-map', widgetId, timezone],
		queryFn: () => getHighImpactHourMap({ timezone: toValue(timezone), widgetId: toValue(widgetId) }),
	});
}

