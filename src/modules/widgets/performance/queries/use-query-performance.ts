import { useInfiniteQuery } from '@tanstack/vue-query';
import type { MaybeRefOrGetter, Ref } from 'vue';
import { computed, onUnmounted, toValue } from 'vue';

import { getPerformance } from '../api';
import { ColumnType } from '@/modules/cell';
import { type QueryData, updateQueryData } from '@/shared/lib';
import { queryClient } from '@/shared/service/query-client';
import { CellUpdater } from '@/shared/service/real-time';
import { Currency, type DateRange, Stock } from '../model';
import { MarketType } from '@/modules/market';

export function useQueryPerformance(
	market: MaybeRefOrGetter<MarketType>,
	pined: MaybeRefOrGetter<string[]>,
	dateRange: MaybeRefOrGetter<DateRange>,
	stockFilter: MaybeRefOrGetter<Stock | undefined>,
	currency: MaybeRefOrGetter<Currency | undefined>,
	limit: Ref<number>,
) {
	const cellUpdater = CellUpdater.getInstance();

	cellUpdater.register(ColumnType.ChangePrice24hPercent, updatedData => {
		queryClient.setQueryData(
			['performance', toValue(market), toValue(pined), toValue(limit)],
			(oldData: QueryData) => updateQueryData(oldData as QueryData, updatedData),
		);
	});

	onUnmounted(() => {
		cellUpdater.disconnect();
	});

	return useInfiniteQuery({
		queryKey: computed(() => [
			'performance',
			toValue(market),
			toValue(pined),
			toValue(dateRange),
			toValue(limit),
			toValue(market) === MarketType.Stock
				? ['stock', toValue(stockFilter)]
				: ['currency', toValue(currency)],
		]),
		queryFn: ({ pageParam = 0 }) => getPerformance({
			market: toValue(market),
			pined: toValue(pined),
			offset: pageParam,
			dateRange: toValue(dateRange),
			...(toValue(market) === MarketType.Stock ?
				{ stockFilter: toValue(stockFilter) } : { quoteCurrency: toValue(currency) }),
			limit: toValue(limit),
		}),

		initialPageParam: 0,
		getNextPageParam: (lastPage) => {
			if (!lastPage) {
				return undefined;
			}

			const { total, offset } = lastPage.pagination;
			const nextOffset = offset + toValue(limit);
			return nextOffset < total ? nextOffset : undefined;
		},
	});
}
