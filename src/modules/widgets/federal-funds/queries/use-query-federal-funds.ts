import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getFederalFunds } from '../api';

export function useQueryFederalFunds(widgetId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey:  ['federal-funds'],
		queryFn: () => getFederalFunds({ widgetId: toValue(widgetId) }),
	});
}

