import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { useQuerySectors } from '../queries';
import { resolveMarketTypeFromTicker } from '@/modules/cell';

interface IOptions {
	tickerId: MaybeRefOrGetter<string>;
}

export function useSectors(options: IOptions) {
	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQuerySectors(options.tickerId);

	const marketType = computed(() => {
		if (data.value) {
			return data.value.marketType;
		}

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
