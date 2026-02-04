import { useQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';

import { getTickerPageMeta, type ITickerMetaRequest } from '../api/get-ticker-page-meta';

export function useQueryTickerPageMeta(req: MaybeRefOrGetter<ITickerMetaRequest>) {
	return useQuery({
		queryKey: ['ticker-page-meta', req],
		queryFn: () => getTickerPageMeta(toValue(req)),
	});
}
