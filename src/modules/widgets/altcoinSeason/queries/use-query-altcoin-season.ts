import { useQuery } from '@tanstack/vue-query';

import { getAltcoinSeason, getAltcoinSeasonWidgetConfig } from '@/modules/widgets/altcoinSeason/api';
import type { IAltcoinSeasonRequest } from '@/modules/widgets/altcoinSeason/model';

export function useQueryAltcoinSeason(request: IAltcoinSeasonRequest) {
	return useQuery({
		queryKey: ['altcoin-season', request.market],
		queryFn: () => getAltcoinSeason(request),
		refetchOnMount: false,
	});
}

export function useQueryAltcoinSeasonWidgetConfig(request: IAltcoinSeasonRequest) {
	return useQuery({
		queryKey: ['altcoin-season-widget-config', request.market],
		queryFn: () => getAltcoinSeasonWidgetConfig(request),
		refetchOnMount: false,
	});
}
