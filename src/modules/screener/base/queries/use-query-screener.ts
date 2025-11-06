import { useInfiniteQuery } from '@tanstack/vue-query';
import { computed, onUnmounted, type Ref, toValue } from 'vue';

import { type ISelectedFilter, ScreenerType } from '../model';
import { useGetScreener } from '../composables';
import { ColumnType, type ColumnWithoutSymbol, type ISort } from '@/modules/cell';
import { type QueryData, updateQueryData } from '@/shared/lib';
import { CellUpdater } from '@/shared/service/real-time';
import { queryClient } from '@/shared/service/query-client';

const realTimeColumns: ColumnWithoutSymbol[] = [
	ColumnType.PriceCurrent,
	ColumnType.Price1yRange,
	ColumnType.Price24hChart,
	ColumnType.Beta5y,
	ColumnType.ChangePrice24h,
	ColumnType.ChangePrice24hPercent,
	ColumnType.Volume24h,
	ColumnType.VolumeAvg50d,
	ColumnType.VolumeRel24h,
	ColumnType.VolumeRelAvg50d,
	ColumnType.PriceEarnings,
	ColumnType.MarketCap24h,
	ColumnType.EpsDil12mo,
	ColumnType.EpsDilAvg50d,
	ColumnType.EpsDilGrowth12mo,
	ColumnType.EpsDilGrowthAvg50d,
	ColumnType.DividendYield,
	ColumnType.LastDividend,
	ColumnType.Employees,
	ColumnType.IpODate,
	ColumnType.AnalystRating,
	ColumnType.Source,
];

export function useQueryScreener(
	screenerType: Ref<ScreenerType>,
	sort: Ref<ISort | null>,
	filters: Ref<ISelectedFilter[]>,
	limit: number,
) {
	const cellUpdater = CellUpdater.getInstance();

	realTimeColumns.forEach(column => {
		cellUpdater.register(column, updatedData => {
			queryClient.setQueryData(
				['screener', screenerType.value, sort.value, filters.value],
				oldData => updateQueryData(oldData as QueryData, updatedData),
			);
		});
	});

	onUnmounted(() => {
		cellUpdater.disconnect();
	});

	return useInfiniteQuery({
		queryKey: computed(() => ['screener', screenerType.value, sort.value, filters.value]),
		queryFn: ({ pageParam = 0 }) =>
			useGetScreener({
				type: toValue(screenerType),
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
