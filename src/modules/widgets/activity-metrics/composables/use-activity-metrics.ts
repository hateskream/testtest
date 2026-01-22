import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { useQueryActivityMetrics } from '../queries';
import type { TickerId } from '../api';
import { resolveMarketTypeFromTicker } from '@/modules/cell';

interface IOptions {
	tickerId: MaybeRefOrGetter<TickerId>;
}

export function useActivityMetrics(options: IOptions) {
	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQueryActivityMetrics(options.tickerId);

	const marketType = computed(() => {
		const tickerId = data.value?.tickerId;

		return resolveMarketTypeFromTicker(tickerId ?? toValue(options.tickerId))!;
	});

	return {
		data,
		isLoading,
		isError,
		refetch,
		marketType,
	};
}
