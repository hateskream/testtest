// import { useQuery } from '@tanstack/vue-query';

// import { getAltcoinSeason } from '@/modules/widgets/altcoinSeason/api';
// import type { IAltcoinSeasonRequest } from '@/modules/widgets/altcoinSeason/model';

// export function useQueryAltcoinSeason(params: IAltcoinSeasonRequest = {}) {
// 	return useQuery({
// 		queryKey: ['altcoin-season', params.period || '90D'],
// 		queryFn: () => getAltcoinSeason(params),
// 		refetchInterval: 30000,
// 		staleTime: 15000,
// 	});
// }
