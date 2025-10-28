import { keepPreviousData, useQuery, type UseQueryReturnType } from '@tanstack/vue-query';

import { getEth, type IGasResponse } from '../api';


export function useQueryEthGas(): UseQueryReturnType<IGasResponse, Error> {
	return useQuery({
		queryKey: ['eth-gas'],
		queryFn: () => getEth(),
		placeholderData: keepPreviousData,
		refetchOnMount: false,
	});
}
