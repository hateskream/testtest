import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getAnnualReturns } from '../api';

export function useQueryAnnualReturns(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['annual-returns', tickerId],
		queryFn: () => getAnnualReturns({ tickerId: toValue(tickerId) }),
	});
}
