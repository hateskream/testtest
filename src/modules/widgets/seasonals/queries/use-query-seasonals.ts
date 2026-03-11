import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getSeasonals } from '../api';

export function useQuerySeasonals(
	tickerId: MaybeRefOrGetter<string>,
	currency: MaybeRefOrGetter<string>,
) {
	return useQuery({
		queryKey: ['seasonals', tickerId],
		queryFn: () =>
			getSeasonals({
				tickerId: toValue(tickerId),
				currency: toValue(currency),
			}),
	});
}
