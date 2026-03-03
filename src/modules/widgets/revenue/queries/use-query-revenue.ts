import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getRevenue } from '../api';
import { type RevenueModeType } from '../model';

export function useQueryRevenue(
	tickerId: MaybeRefOrGetter<string>,
	mode: MaybeRefOrGetter<RevenueModeType>,
) {
	return useQuery({
		queryKey: ['revenue', tickerId, mode],
		queryFn: () => getRevenue({
			tickerId: toValue(tickerId),
			mode: toValue(mode),
		}),
	});
}
