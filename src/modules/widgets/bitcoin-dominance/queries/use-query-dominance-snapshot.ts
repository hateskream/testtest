import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getDominanceSnapshot } from '../api';

export function useQueryDominanceSnapshot(tickers: MaybeRefOrGetter<string[]>) {
	return useQuery({
		queryKey:  ['dominance', tickers],
		queryFn: () => getDominanceSnapshot({
			tickers: toValue(tickers).join(','),
		}),
	});
}
