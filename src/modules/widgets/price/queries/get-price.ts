import { useInfiniteQuery } from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, onUnmounted, toValue } from 'vue';

import { getPrice, type IPriceData } from '../api';
import { ColumnType, type ColumnWithoutSymbol } from '@/modules/cell';
import { CellUpdater, type Message } from '@/shared/service/real-time';
import { type QueryData, updateInfiniteQueryData } from '@/shared/lib';
import { queryClient } from '@/shared/service/query-client';
import type { FiltersState, PriceMarketType } from '../model';

export function useQueryPrice(
	market: MaybeRefOrGetter<PriceMarketType>,
	filters: MaybeRefOrGetter<FiltersState>,
	pined: MaybeRefOrGetter<string[]>,
	limit: number,
) {
	const cellUpdater = CellUpdater.getInstance();

	cellUpdater.register(ColumnType.PriceCurrent, updatedData => {
		queryClient.setQueryData(
			['price', toValue(market), ...toValue(pined), limit],
			(oldData: QueryData<IPriceData>) => updateQueryData(oldData as QueryData<IPriceData>, updatedData),
		);
	});

	cellUpdater.register(ColumnType.ChangePrice24hPercent, updatedData => {
		queryClient.setQueryData(
			['price', toValue(market), ...toValue(pined), limit],
			(oldData: QueryData<IPriceData>) => updateQueryData(oldData as QueryData<IPriceData>, updatedData),
		);
	});

	onUnmounted(() => {
		cellUpdater.disconnect();
	});

	return useInfiniteQuery({
		queryKey: computed(() => ['price', toValue(market), ...toValue(pined), limit, toValue(filters)]),
		queryFn: ({ pageParam = 0 }) =>
			getPrice({
				market: toValue(market),
				pined: toValue(pined),
				offset: pageParam,
				limit: toValue(limit),
				filters: toValue(filters),
			}),
		initialPageParam: 0,
		getNextPageParam: (lastPage) => {
			if (!lastPage) {
				return undefined;
			}

			const { total, offset } = lastPage.pagination;
			const nextOffset = offset + limit;
			return nextOffset < total ? nextOffset : undefined;
		},
	});
}

function updateQueryData<T extends ColumnWithoutSymbol>(
	oldData:QueryData<IPriceData>,
	updatedData: Message<T>,
) {
	return updateInfiniteQueryData(oldData, (page) => ({
		...page,
		tickers: page.tickers
			.map((ticker) =>
				ticker.tickerId === updatedData.tickerId
					? {
						...ticker,
						...updatedData,
					}
					: ticker,
			),
		pinedTickers: page.pinedTickers
			.map((ticker) =>
				ticker.tickerId === updatedData.tickerId
					? {
						...ticker,
						...updatedData,
					}
					: ticker,
			),
	}));
}
