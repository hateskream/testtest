import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getCpi } from '../api';
import { CpiMetric, CpiRange } from './../model';

export function useQueryCpi(metric: MaybeRefOrGetter<CpiMetric>, range: MaybeRefOrGetter<CpiRange>) {
	return useQuery({
		queryKey:  ['market-cap', metric, range],
		queryFn: () => getCpi({ metric: toValue(metric), range: toValue(range) }),
	});
}

