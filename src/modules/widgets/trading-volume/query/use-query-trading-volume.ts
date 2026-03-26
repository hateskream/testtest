import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getTradingVolume } from '../api';

export function useQueryTradingVolume(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['trading-volume', tickerId],
		queryFn: () => getTradingVolume({ tickerId: toValue(tickerId) }),
	});
}
