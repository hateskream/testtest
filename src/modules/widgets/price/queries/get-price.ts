import { useInfiniteQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, onUnmounted, toValue } from 'vue';

import { getPrice, type IPriceData } from '../api';
import { ColumnType, type ColumnWithoutSymbol } from '@/modules/cell';
import { CellUpdater, type Message } from '@/shared/service/real-time';
import { type QueryData, updateInfiniteQueryData } from '@/shared/lib';
import { queryClient } from '@/shared/service/query-client';
import type { FiltersState } from '../model';
import type { MarketType } from '@/modules/market';

export function useQueryPrice(
	market: MaybeRefOrGetter<MarketType>,
	filters: MaybeRefOrGetter<FiltersState>,
	limit: MaybeRefOrGetter<number>,
) {
	const cellUpdater = CellUpdater.getInstance();

	cellUpdater.register(ColumnType.PriceCurrent, updatedData => {
		queryClient.setQueryData(
			['price', toValue(market), limit],
			(oldData: QueryData<IPriceData>) => updateQueryData(oldData as QueryData<IPriceData>, updatedData),
		);
	});

	cellUpdater.register(ColumnType.ChangePrice24hPercent, updatedData => {
		queryClient.setQueryData(
			['price', toValue(market), limit],
			(oldData: QueryData<IPriceData>) => updateQueryData(oldData as QueryData<IPriceData>, updatedData),
		);
	});

	onUnmounted(() => {
		cellUpdater.disconnect();
	});

	return useInfiniteQuery({
		queryKey: ['price', market, limit, filters],
		queryFn: ({ pageParam = 0 }) =>
			getPrice({
				market: toValue(market),
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
			const nextOffset = offset + toValue(limit);
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
