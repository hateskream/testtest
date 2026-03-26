import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getAnnualMarginTrends } from '../api';

export function useQueryAnnualMarginTrends(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['annual-margin-trends', tickerId],
		queryFn: () => getAnnualMarginTrends({ tickerId: toValue(tickerId) }),
	});
}
