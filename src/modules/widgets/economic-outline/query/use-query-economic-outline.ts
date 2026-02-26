import { useQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';

import { getEconomicOutline, type IEconomicOutlineRequest } from '../api/get-economic-outline';

export function useQueryEconomicOutline(args: MaybeRefOrGetter<IEconomicOutlineRequest>) {
	return useQuery({
		queryKey: ['economic-outline', args],
		queryFn: () => getEconomicOutline(toValue(args)),
	});
}
