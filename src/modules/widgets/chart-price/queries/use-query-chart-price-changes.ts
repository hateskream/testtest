import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getChartPriceChanges } from '../api';

export function useQueryChartPriceChanges(ticker: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey:  ['price-change', ticker],
		queryFn: async () => {
			const response = await getChartPriceChanges({ ticker: toValue(ticker) });
			return response.changes;
		},
	});
}
