import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getEpsTiles } from '../api';

export function useQueryEpsTiles(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['eps-tiles', tickerId],
		queryFn: () => getEpsTiles({ tickerId: toValue(tickerId) }),
	});
}
