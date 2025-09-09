import { useInfiniteQuery } from '@tanstack/vue-query';
import { computed, onUnmounted, toValue, watch, type Ref } from 'vue';

import { getPrice, type IPriceData } from '../api';
import type { MarketType } from '@/modules/market';
import { ColumnType, type ColumnWithoutSymbol } from '@/modules/cell';
import { CellUpdater, type Message } from '@/shared/service/real-time';
import { updateInfiniteQueryData, type QueryData } from '@/shared/lib';
import { queryClient } from '@/shared/service/query-client';

export function useQueryPrice(
	market: Ref<MarketType>,
	pined: Ref<string[]>,
	limit: number,
) {
	const cellUpdater = CellUpdater.getInstance();

	cellUpdater.register(ColumnType.PriceCurrent, updatedData => {
		queryClient.setQueryData(
			['price', market.value],
			oldData => updateQueryData(oldData as QueryData<IPriceData>, updatedData),
		);
	});

	watch(market, newMarket => {
		queryClient.invalidateQueries({ queryKey: ['price', newMarket] });
	});

	onUnmounted(() => {
		cellUpdater.disconnect();
	});

	return useInfiniteQuery({
		queryKey: computed(() => ['price', market.value]),
		queryFn: ({ pageParam = 0 }) =>
			getPrice({
				market: toValue(market),
				pined: toValue(pined),
				offset: pageParam,
				limit: toValue(limit),
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
