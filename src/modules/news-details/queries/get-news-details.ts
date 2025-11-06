import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import type { IGetNewsDetailsRequest } from '@/modules/news';
import { getNewsDetails } from '../api';

export function useQueryNewsDetails(_req: MaybeRefOrGetter<IGetNewsDetailsRequest>) {
	const req = computed(() => toValue(_req));

	return useQuery({
		queryKey: [req],
		queryFn: () => getNewsDetails(req.value),
	});
}
