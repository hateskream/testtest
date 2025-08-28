import { keepPreviousData, useQuery } from '@tanstack/vue-query';

import { getTension } from '../api';

export function useQueryTension() {
	return useQuery({
		queryKey: ['fear-greed'],
		queryFn: () => getTension(),
		placeholderData: keepPreviousData,
		refetchOnMount: false,
	});
}
