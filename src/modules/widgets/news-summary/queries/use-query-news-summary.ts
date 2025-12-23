import { useQuery } from '@tanstack/vue-query';

import { getNewsSummary } from '../api';

export function useQueryNewsSummary() {
	return useQuery({
		queryKey:  ['news-summary'],
		queryFn: () => getNewsSummary(),
	});
}

