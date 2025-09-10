import { useQuery } from '@tanstack/vue-query';

import { getAssetsTickerSelector } from '../api';

export function useQueryTickerSelector() {
	return useQuery({
		queryKey: ['ticker-selector'],
		queryFn: () => getAssetsTickerSelector(),
	});
}
