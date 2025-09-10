import { useInfiniteQuery } from '@tanstack/vue-query';
import type { MaybeRefOrGetter } from 'vue';
import { computed, onUnmounted, toValue } from 'vue';

import { getPerformance } from '../api';
import type { DateRange, Stock } from '../model';
import { ColumnType } from '@/modules/cell';
import { updateQueryData, type QueryData } from '@/shared/lib';
import { queryClient } from '@/shared/service/query-client';
import { CellUpdater } from '@/shared/service/real-time';

export function useQueryPerformance(
	stock: MaybeRefOrGetter<Stock>,
	date: MaybeRefOrGetter<DateRange>,
	limit: number,
) {
	const cellUpdater = CellUpdater.getInstance();

	cellUpdater.register(ColumnType.ChangePrice24hPercent, updatedData => {
		queryClient.setQueryData(
			['performance', toValue(stock), toValue(date)],
			oldData => updateQueryData(oldData as QueryData, updatedData),
		);
	});

	onUnmounted(() => {
		cellUpdater.disconnect();
	});

	return useInfiniteQuery({
		queryKey: computed(() => {
			return ['performance', toValue(stock), toValue(date)];
		}),
		queryFn: ({ pageParam = 0 }) => getPerformance({
			stock: toValue(stock),
			date: toValue(date),
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
