import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { getTickerIdMarket, type TickerId } from '@/modules/ticker';
import { useQueryActivityMetrics } from '../queries';

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

	const tickerMarket = computed(() => {
		const tickerId = data.value?.tickerId;

		return getTickerIdMarket(tickerId ?? toValue(options.tickerId));
	});

	return {
		data,
		isLoading,
		isError,
		refetch,
		tickerMarket,
	};
}
