import { useQuery } from '@tanstack/vue-query';

import { getMarket } from '../api';

export function useQueryMarket() {
	return useQuery({
		queryKey: ['market'],
		queryFn: () => getMarket(),
	});
}
