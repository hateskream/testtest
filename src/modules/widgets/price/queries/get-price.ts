import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { getPrice } from '../api';

export function useQueryPrice(market: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: computed(() => ['price', toValue(market)]),
		queryFn: () => getPrice({ market: toValue(market) }),
		placeholderData: keepPreviousData,
	});
}
