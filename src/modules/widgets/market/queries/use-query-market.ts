import { useInfiniteQuery } from '@tanstack/vue-query';
import { computed, onUnmounted, toValue, type Ref } from 'vue';

import type { MarketType } from '@/modules/market';
import type { ISelectedFilter } from '../model';
import { useGetMarket } from '../composables/use-get-market';
import { ColumnType, type ColumnWithoutSymbol, type ISort, type TableRow } from '@/modules/cell';
import { updateQueryData, type QueryData } from '@/shared/lib';
import { queryClient } from '@/shared/service/query-client';
import { CellUpdater } from '@/shared/service/real-time';

const realTimeColumns: ColumnWithoutSymbol[] = [
	ColumnType.PriceCurrent,
	ColumnType.ChangePrice24h,
	ColumnType.ChangePrice24hPercent,
	ColumnType.Volume24h,
	ColumnType.PriceMin24h,
	ColumnType.PriceMax24h,
	ColumnType.PriceMin1y,
	ColumnType.PriceMax1y,
	ColumnType.PriceAvg50d,
	ColumnType.PriceAvg200d,
	ColumnType.PriceOpen,
	ColumnType.PriceClose,
	ColumnType.AllTimeHigh,
	ColumnType.AllTimeHighChangePercent,
	ColumnType.AllTimeLow,
	ColumnType.AllTimeLowChangePercent,
	ColumnType.MarketCap24h,
	ColumnType.MarketCapFullyDiluted,
	ColumnType.MarketCapChange24h,
	ColumnType.MarketCapChange24hPercent,
	ColumnType.CirculatingSupply,
	ColumnType.TotalSupply,
	ColumnType.MaxSupply,
	ColumnType.Price1yRange,
	ColumnType.Beta5y,
	ColumnType.LastDividend,
	ColumnType.VolumeAvg50d,
];

export interface IData {
	tickers: TableRow[];
}

export function useQueryMarket(
	market: Ref<MarketType>,
	sort: Ref<ISort | null>,
	filters: Ref<ISelectedFilter[]>,
	limit: number,
) {
	const cellUpdater = CellUpdater.getInstance();

	realTimeColumns.forEach(column => {
		cellUpdater.register(column, updatedData => {
			queryClient.setQueryData(
				['market', market.value, sort.value, filters.value],
				oldData => updateQueryData(oldData as QueryData, updatedData),
			);
		});
	});

	onUnmounted(() => {
		cellUpdater.disconnect();
	});

	return useInfiniteQuery({
		queryKey: computed(() => ['market', market.value, sort.value, filters.value]),
		queryFn: ({ pageParam = 0 }) =>
			useGetMarket({
				market: toValue(market),
				offset: pageParam,
				limit: toValue(limit),
				sort: toValue(sort),
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
