import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getUsInflation } from '../api';

export function useQueryUsInflation(widgetId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey:  ['us-inflation'],
		queryFn: () => getUsInflation({ widgetId: toValue(widgetId) }),
	});
}

