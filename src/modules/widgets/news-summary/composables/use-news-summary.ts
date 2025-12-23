import { computed } from 'vue';

import { useQueryNewsSummary } from '../queries';
import { mapNewSummaryToDomain } from '../model';

export function useNewsSummary() {
	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQueryNewsSummary();

	const domainData = computed(() => data.value ? mapNewSummaryToDomain(data.value) : undefined);

	return {
		data: domainData,
		isError,
		isLoading,
		refetch,
	};
}
