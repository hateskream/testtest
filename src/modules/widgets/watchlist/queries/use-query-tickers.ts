import { useQuery } from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, onUnmounted, toValue } from 'vue';

import { getTickers } from '../api';
import { ColumnType, type ColumnWithoutSymbol, type TableRow } from '@/modules/cell';
import { updateTickers } from '@/shared/lib';
import { queryClient } from '@/shared/service/query-client';
import { CellUpdater } from '@/shared/service/real-time';

const realTimeColumns: ColumnWithoutSymbol[] = [
	ColumnType.PriceCurrent,
	ColumnType.PriceMin24h,
	ColumnType.PriceMax24h,
	ColumnType.PriceMin1y,
	ColumnType.PriceMax1y,
	ColumnType.PriceAvg50d,
	ColumnType.PriceAvg200d,
	ColumnType.PriceOpen,
	ColumnType.PriceClose,
	ColumnType.Price1yRange,

	ColumnType.Price24hChart,
	ColumnType.Price7dChart,
	ColumnType.Price30dChart,

	ColumnType.ChangePrice24h,
	ColumnType.ChangePrice1hPercent,
	ColumnType.ChangePrice24hPercent,
	ColumnType.ChangePrice7dPercent,
	ColumnType.ChangePrice30dPercent,

	ColumnType.Volume24h,
	ColumnType.VolumeRel10d,
	ColumnType.VolumeAvg10d,
	ColumnType.VolumeAvg50d,

	ColumnType.MarketCap24h,
	ColumnType.MarketCapRank,
	ColumnType.MarketCapFullyDiluted,
	ColumnType.MarketCapChange24h,
	ColumnType.MarketCapChange24hPercent,
	ColumnType.CirculatingSupply,
	ColumnType.TotalSupply,
	ColumnType.MaxSupply,

	ColumnType.AllTimeHigh,
	ColumnType.AllTimeHighChangePercent,
	ColumnType.AllTimeHighDate,
	ColumnType.AllTimeLow,
	ColumnType.AllTimeLowChangePercent,
	ColumnType.AllTimeLowDate,

	ColumnType.RSIValue,
	ColumnType.RSIChart,

	ColumnType.Beta5y,
	ColumnType.LastDividend,

	ColumnType.Employees,
	ColumnType.IpODate,
	ColumnType.Sector,
	ColumnType.Industry,

	ColumnType.Source,
	ColumnType.ListingDate,
	ColumnType.UpdateDate,
	ColumnType.Volatility,
];


export function useQueryTickers(tickerIds: MaybeRefOrGetter<string[]>) {
	const cellUpdater = CellUpdater.getInstance();

	realTimeColumns.forEach(column => {
		cellUpdater.register(column, updatedData => {
			queryClient.setQueryData(
				['watchlist', toValue(tickerIds)],
				oldData => updateTickers(oldData as TableRow[], updatedData),
			);
		});
	});

	onUnmounted(() => {
		cellUpdater.disconnect();
	});

	return useQuery({
		queryKey: computed(() => ['watchlist', toValue(tickerIds)]),
		queryFn: () => getTickers({
			tickerIds: toValue(tickerIds),
		}),
		refetchOnMount: false,
	});
}
