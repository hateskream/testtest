import { useInfiniteQuery } from '@tanstack/vue-query';
import type { MaybeRefOrGetter } from 'vue';
import { computed, onUnmounted, toValue } from 'vue';

import { getPerformance } from '../api';
import { ColumnType } from '@/modules/cell';
import { updateQueryData, type QueryData } from '@/shared/lib';
import { queryClient } from '@/shared/service/query-client';
import { CellUpdater } from '@/shared/service/real-time';
import type { MarketType } from '@/modules/market';

export function useQueryPerformance(
	market: MaybeRefOrGetter<MarketType>,
	pined: MaybeRefOrGetter<string[]>,
	limit: number,
) {
	const cellUpdater = CellUpdater.getInstance();

	cellUpdater.register(ColumnType.ChangePrice24hPercent, updatedData => {
		queryClient.setQueryData(
			['performance', toValue(market), toValue(pined)],
			(oldData: QueryData) => updateQueryData(oldData as QueryData, updatedData),
		);
	});

	onUnmounted(() => {
		cellUpdater.disconnect();
	});

	return useInfiniteQuery({
		queryKey: computed(() => {
			return ['performance', toValue(market), toValue(pined)];
		}),
		queryFn: ({ pageParam = 0 }) => getPerformance({
			market: toValue(market),
			pined: toValue(pined),
			offset: pageParam,
			limit,
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
