import { useQuery } from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { getMarketCap } from '../api';
import { isNonEmptyArray } from '@/shared/lib';
import { DateRangePreset, type DateRangeValue } from '@/modules/charts/common/model';


export function useQueryMarketCap(
	tickers: MaybeRefOrGetter<string[]>,
	markets: MaybeRefOrGetter<string[]>,
	range: MaybeRefOrGetter<DateRangeValue>,
) {
	const enabled = computed(() => isNonEmptyArray(toValue(tickers)) || isNonEmptyArray(toValue(markets)));

	return useQuery({
		queryKey:  ['market-cap', tickers, markets, range],
		queryFn: () => {
			const rangeValue = toValue(range);
			// TODO: from/to
			const preparedRange = rangeValue.type === 'preset' ? rangeValue.preset : DateRangePreset.Day;

			return getMarketCap({
				tickers: toValue(tickers),
				range: preparedRange,
				markets: toValue(markets),
			});
		},
		enabled,
	});
}
