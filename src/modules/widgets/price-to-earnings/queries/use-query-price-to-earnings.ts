import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getPriceToEarnings } from '../api';

export function useQueryPriceToEarnings(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['price-to-earnings', tickerId],
		queryFn: () => getPriceToEarnings({ tickerId: toValue(tickerId) }),
	});
}
