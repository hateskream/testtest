import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getWhaleHoldings } from '../api';

export function useQueryWhaleHoldings(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['whale-holdings', tickerId],
		queryFn: () => getWhaleHoldings({ tickerId: toValue(tickerId) }),
	});
}
