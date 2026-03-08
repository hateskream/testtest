import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getAddressesByHoldings } from '../api';

export function useQueryAddressesByHoldings(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['addresses-by-holdings', tickerId],
		queryFn: () => getAddressesByHoldings({ tickerId: toValue(tickerId) }),
	});
}
