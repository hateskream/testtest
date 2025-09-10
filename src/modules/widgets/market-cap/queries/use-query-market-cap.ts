import { useQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';

import { getMarketCap } from '../api';


export function useQueryMarketCap(tickersIds: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey:  ['market-cap', tickersIds],
		queryFn: () => getMarketCap({
			tickersIds: toValue(tickersIds),
		}),
	});
}
