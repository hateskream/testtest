import { useQuery } from '@tanstack/vue-query';

import { getMarket, type IGetMarketRequest } from '../api';

export function useQueryMarket(args: IGetMarketRequest) {
	return useQuery({
		queryKey: ['market', args.market, args.sort],
		queryFn: () => getMarket(args),
		refetchOnMount: false,
	});
}
