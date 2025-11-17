import { useQuery } from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { getMarketCap } from '../api';
import { MarketCapDateRange } from './../model';
import { isNonEmptyArray } from '@/shared/lib';


export function useQueryMarketCap(
	tickers: MaybeRefOrGetter<string[]>,
	markets: MaybeRefOrGetter<string[]>,
	range: MaybeRefOrGetter<MarketCapDateRange>,
) {
	const enabled = computed(() => isNonEmptyArray(toValue(tickers)) || isNonEmptyArray(toValue(markets)));

	return useQuery({
		queryKey:  ['market-cap', tickers, markets, range],
		queryFn: () => getMarketCap({
			tickers: toValue(tickers),
			range: toValue(range),
			markets: toValue(markets),
		}),
		enabled,
	});
}
