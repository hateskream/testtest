import { useQuery } from '@tanstack/vue-query';

import { getBitcoinDominanc, type IGetBitcoinDominancRequest } from '../api';


export function useQueryBintcoinDominanc(args: IGetBitcoinDominancRequest) {
	return useQuery({
		queryKey: ['bitcoin-dominance', args.market],
		queryFn: () => getBitcoinDominanc(args),
	});
}
