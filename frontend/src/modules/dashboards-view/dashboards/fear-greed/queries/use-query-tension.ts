import { useQuery } from '@tanstack/vue-query';

import { getTension } from '../api';

export function useQueryTension(market: string) {
	return useQuery({
		queryKey: ['market', market],
		queryFn: () => getTension({ market }),
	});
}
