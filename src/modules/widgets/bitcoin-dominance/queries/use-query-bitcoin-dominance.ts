import { useQuery } from '@tanstack/vue-query';

import { getBitcoinDominance, type IGetBitcoinDominanceRequest } from '../api';


export function useQueryBintcoinDominance(args: IGetBitcoinDominanceRequest) {
	return useQuery({
		queryKey: ['market-cap', args.market],
		queryFn: () => getBitcoinDominance(args),
	});
}
