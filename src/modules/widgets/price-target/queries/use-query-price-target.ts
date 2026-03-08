import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getPriceTarget } from '../api';

export function useQueryPriceTarget(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['price-target', tickerId],
		queryFn: () => getPriceTarget({ tickerId: toValue(tickerId) }),
	});
}
