import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getCpi } from '../api';
import { CpiRange } from './../model';

export function useQueryCpi(range: MaybeRefOrGetter<CpiRange>) {
	return useQuery({
		queryKey:  ['cpi', range],
		queryFn: () => getCpi({ range: toValue(range) }),
	});
}

