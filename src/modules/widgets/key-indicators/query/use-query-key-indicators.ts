import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import type { IKeyIndicatorRequest } from '../model/contract';
import { getKeyIndicators } from '../api/get-key-indicators';

export function useQueryKeyIndicators(_request: MaybeRefOrGetter<IKeyIndicatorRequest>) {
	const request = computed(
		() => toValue(_request),
	);

	return useQuery({
		queryKey: ['key-indicators', () => request.value.ticker_id],
		queryFn: () => getKeyIndicators({
			ticker_id: request.value.ticker_id,
		}),
	});
}
