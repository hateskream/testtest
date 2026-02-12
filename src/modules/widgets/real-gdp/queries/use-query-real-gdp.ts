import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getRealGdp } from '../api';
import { type RealGdpDateRangePresetType } from './../model';

export function useQueryRealGdp(range: MaybeRefOrGetter<RealGdpDateRangePresetType>) {
	return useQuery({
		queryKey:  ['real-gdp', range],
		queryFn: () => getRealGdp({ range: toValue(range) }),
	});
}

