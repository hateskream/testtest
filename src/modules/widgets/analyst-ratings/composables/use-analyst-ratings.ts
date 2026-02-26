import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { useQueryAnalystRatings } from '../queries';
import { resolveMarketTypeFromTicker } from '@/modules/cell';

interface IOptions {
	tickerId: MaybeRefOrGetter<string>;
}

export function useAnalystRatings(options: IOptions) {
	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQueryAnalystRatings(options.tickerId);

	const marketType = computed(() => {
		return resolveMarketTypeFromTicker(toValue(options.tickerId))!;
	});

	return {
		data,
		isLoading,
		isError,
		refetch,
		marketType,
	};
}
