import { useQuery } from '@tanstack/vue-query';
import { unref, type Ref, type ComputedRef } from 'vue';

import { getWatchlistSections, type IGetWatchlistRequest } from '../api';

export function useQueryWatchlist(
	args:	IGetWatchlistRequest |	Ref<IGetWatchlistRequest> |	ComputedRef<IGetWatchlistRequest>,
) {
	return useQuery({
		queryKey: [
			'watchlist',
			() => unref(args).market,
			() => unref(args).sort,
			() => unref(args).watchlistIdx,
		],
		queryFn: () => getWatchlistSections(unref(args)),
	});
}
