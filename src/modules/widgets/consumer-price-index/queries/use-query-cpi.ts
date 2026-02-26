import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getCpi } from '../api';
import { type CpiDateRangePresetType } from './../model';

export function useQueryCpi(range: MaybeRefOrGetter<CpiDateRangePresetType>) {
	return useQuery({
		queryKey:  ['cpi', range],
		queryFn: () => getCpi({ range: toValue(range) }),
	});
}

