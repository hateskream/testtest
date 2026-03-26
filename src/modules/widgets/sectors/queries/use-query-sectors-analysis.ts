import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getSectorsAnalysis } from '../api';

export function useQuerySectorsAnalysis(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['sectors-analysis', tickerId],
		queryFn: () => getSectorsAnalysis({ tickerId: toValue(tickerId) }),
	});
}

