import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { type DateRangeValue, toDateRange } from '@/modules/lightweight-charts/model';
import { getChartPriceHistory } from '../api';

export function useQueryChartPriceHistory(
	ticker: MaybeRefOrGetter<string>,
	range: MaybeRefOrGetter<DateRangeValue>,
) {
	return useQuery({
		queryKey:  ['chart-price-history', ticker, range],
		queryFn: async () => {
			const { from, to } = toDateRange(toValue(range));

			const response = await getChartPriceHistory({
				ticker: toValue(ticker),
				from: from,
				to: to,
			});

			return response.data;
		},
	});
}
