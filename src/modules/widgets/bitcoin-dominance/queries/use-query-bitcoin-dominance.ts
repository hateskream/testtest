import { useQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';

import { getBitcoinDominance } from '../api';


export function useQueryBintcoinDominance(tickersIds: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey:  ['bitcoin-dominance', tickersIds],
		queryFn: () => getBitcoinDominance({
			tickersIds: toValue(tickersIds),
		}),
	});
}
