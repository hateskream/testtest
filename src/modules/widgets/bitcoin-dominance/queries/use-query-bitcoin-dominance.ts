import { useQuery } from '@tanstack/vue-query';

import { getBitcoinDominance, type IGetBitcoinDominanceRequest } from '../api';


export function useQueryBintcoinDominance(args: IGetBitcoinDominanceRequest) {
	return useQuery({
		queryKey: ['bitcoin-dominance', args.market],
		queryFn: () => getBitcoinDominance(args),
	});
}
