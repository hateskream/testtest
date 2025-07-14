import { useQuery } from '@tanstack/vue-query';

import { getPrice } from '../api';

export function useQueryPrice(market: string) {
	return useQuery({
		queryKey: ['price', market],
		queryFn: () => getPrice({ market }),
		refetchOnMount: false,
	});
}
