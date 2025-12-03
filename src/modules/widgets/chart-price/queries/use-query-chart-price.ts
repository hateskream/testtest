import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import type { MarketType } from '@/modules/market';
import { getChartPrice } from '../api';
import { TimeRangeFilterValue } from './../model';

export function useQueryChartPrice(
	ticker: MaybeRefOrGetter<string>,
	market: MaybeRefOrGetter<MarketType>,
	range: MaybeRefOrGetter<TimeRangeFilterValue>,
) {
	return useQuery({
		queryKey:  ['chart-price', ticker, market, range],
		queryFn: () => getChartPrice({
			ticker: toValue(ticker),
			market: toValue(market),
			range: toValue(range),
		}),
	});
}
