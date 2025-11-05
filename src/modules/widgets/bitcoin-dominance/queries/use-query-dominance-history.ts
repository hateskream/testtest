import { useQuery } from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { DominanceDateRange } from '../model';
import { getDominanceHistory } from '../api';

export function useQueryDominanceHistory(
	tickers: MaybeRefOrGetter<string[]>,
	range: MaybeRefOrGetter<DominanceDateRange>,
) {
	return useQuery({
		queryKey: computed(() => ['dominance', toValue(tickers), toValue(range)]),
		queryFn: () => getDominanceHistory({
			tickers: toValue(tickers),
			range: toValue(range),
		}),
	});
}

