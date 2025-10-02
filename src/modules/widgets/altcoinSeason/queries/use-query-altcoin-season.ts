import { useQuery } from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { getAltcoinSeason, type IAltcoinSeasonRequest } from '@/modules/widgets/altcoinSeason/api';

export function useQueryAltcoinSeason(_request: MaybeRefOrGetter<IAltcoinSeasonRequest>) {
	const request = computed(
		() => toValue(_request),
	);

	return useQuery({
		queryKey: [
			'altcoin-season',
			request.value.market,
			request.value.period,
		],
		queryFn: () => getAltcoinSeason(request.value),
		refetchOnMount: false,
	});
}
