import { keepPreviousData, useQuery } from '@tanstack/vue-query';

import { getEth } from '../api';

export function useQueryEthGas() {
	return useQuery({
		queryKey: ['eth-gas'],
		queryFn: () => getEth(),
		placeholderData: keepPreviousData,
		refetchOnMount: false,
	});
}
