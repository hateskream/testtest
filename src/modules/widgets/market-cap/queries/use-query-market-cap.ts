import { useQuery } from '@tanstack/vue-query';

import { getMarketCap, type IGetMarketCapRequest } from '../api';


export function useQueryMarketCap(args: IGetMarketCapRequest) {
	return useQuery({
		queryKey: ['market-cap', args.market],
		queryFn: () => getMarketCap(args),
	});
}
