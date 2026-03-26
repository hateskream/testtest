import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getEarningsPerShare } from '../api';

export function useQueryEarningsPerShare(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['earnings-per-share', tickerId],
		queryFn: () => getEarningsPerShare({ tickerId: toValue(tickerId) }),
	});
}
