import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getNominalGdp } from '../api';
import { type NominalGdpDateRangePresetType } from './../model';

export function useQueryNominalGdp(range: MaybeRefOrGetter<NominalGdpDateRangePresetType>) {
	return useQuery({
		queryKey:  ['nominal-gdp', range],
		queryFn: () => getNominalGdp({ range: toValue(range) }),
	});
}

