import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getSectors } from '../api';

export function useQuerySectors(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['sectors', tickerId],
		queryFn: () => getSectors({ tickerId: toValue(tickerId) }),
	});
}

