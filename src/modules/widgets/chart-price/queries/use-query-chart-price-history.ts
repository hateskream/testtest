import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { type DateRangeValue, toUtcSecondsRange } from '@/modules/lightweight-charts/model';
import { getChartPriceHistory } from '../api';

export function useQueryChartPriceHistory(
	ticker: MaybeRefOrGetter<string>,
	range: MaybeRefOrGetter<DateRangeValue>,
) {
	return useQuery({
		queryKey:  ['chart-price-history', ticker, range],
		queryFn: async () => {
			const { from, to } = toUtcSecondsRange(toValue(range));

			const response = await getChartPriceHistory({
				ticker: toValue(ticker),
				from,
				to,
			});

			return response.data;
		},
	});
}
