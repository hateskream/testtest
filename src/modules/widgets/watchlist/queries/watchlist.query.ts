import { useQuery } from '@tanstack/vue-query';

import { getWatchlist, type IGetWatchlistRequest } from '../api';

export function useQueryWatchlist(args: IGetWatchlistRequest) {
	return useQuery({
		queryKey: ['watchlist', args.market, args.sort],
		queryFn: () => getWatchlist(args),
	});
}
