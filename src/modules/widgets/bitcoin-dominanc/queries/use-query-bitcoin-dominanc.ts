import { useQuery } from '@tanstack/vue-query';

import { getBitcoinDominanc, type IGetBitcoinDominancRequest } from '../api';


export function useQueryBintcoinDominanc(args: IGetBitcoinDominancRequest) {
	return useQuery({
		queryKey: ['market-cap', args.market],
		queryFn: () => getBitcoinDominanc(args),
	});
}
