import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getMarketCap } from '../api';
import { MarketCapDateRange } from './../model';


export function useQueryMarketCap(tickers: MaybeRefOrGetter<string[]>, range: MaybeRefOrGetter<MarketCapDateRange>) {
	return useQuery({
		queryKey:  ['market-cap', tickers, range],
		queryFn: () => getMarketCap({ tickers: toValue(tickers), range: toValue(range) }),
	});
}
