import { useInfiniteQuery } from '@tanstack/vue-query';
import { computed, onUnmounted, toValue } from 'vue';

import { getTopIndicesCrypto } from '../api';
import { type ColumnWithoutSymbol, ColumnType } from '@/modules/cell';
import { updateQueryData, type QueryData } from '@/shared/lib';
import { queryClient } from '@/shared/service/query-client';
import { CellUpdater } from '@/shared/service/real-time';

const realTimeColumns: ColumnWithoutSymbol[] = [
	ColumnType.ChangePrice24hPercent,
	ColumnType.ChangePrice24h,
	ColumnType.Volatility,
];

export function useQueryTopIndices(
	limit: number,
) {
	const cellUpdater = CellUpdater.getInstance();

	realTimeColumns.forEach(column => {
		cellUpdater.register(column, updatedData => {
			queryClient.setQueryData(
				['top-indices'],
				oldData => updateQueryData(oldData as QueryData, updatedData),
			);
		});
	});

	onUnmounted(() => {
		cellUpdater.disconnect();
	});

	return useInfiniteQuery({
		queryKey: computed(() => ['top-indices']),
		queryFn: ({ pageParam = 0 }) =>
			getTopIndicesCrypto({
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
