import { useQuery } from '@tanstack/vue-query';

import { getAltcoinSeason, type IAltcoinSeasonRequest } from '@/modules/widgets/altcoinSeason/api';

export function useQueryAltcoinSeason(request: IAltcoinSeasonRequest) {
	return useQuery({
		queryKey: ['altcoin-season', request.market],
		queryFn: () => getAltcoinSeason(request),
		refetchOnMount: false,
	});
}
