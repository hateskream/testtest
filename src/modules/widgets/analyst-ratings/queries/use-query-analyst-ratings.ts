import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getAnalystRatings } from '../api';

export function 	useQueryAnalystRatings(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['analyst-ratings', tickerId],
		queryFn: () => getAnalystRatings({ tickerId: toValue(tickerId) }),
	});
}

