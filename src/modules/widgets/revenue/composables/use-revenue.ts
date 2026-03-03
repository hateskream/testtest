import type { MaybeRefOrGetter } from 'vue';
import { ref } from 'vue';

import { RevenueMode, type RevenueModeType } from '../model';
import { useQueryRevenue } from '../queries';

interface IUseRevenueOptions {
	tickerId: MaybeRefOrGetter<string>;
}

export function useRevenue({ tickerId }: IUseRevenueOptions) {
	const activeMode = ref<RevenueModeType>(RevenueMode.Quarterly);

	const { data, isLoading, isError, refetch } = useQueryRevenue(
		tickerId,
		activeMode,
	);

	return {
		activeMode,
		data,
		isLoading,
		isError,
		refetch,
	};
}
