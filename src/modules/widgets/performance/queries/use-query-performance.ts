import { useQuery } from '@tanstack/vue-query';

import { getPerformance } from '../api';
import type { IGetPerformanceRequest } from '../model';

export function useQueryPerformance(args: IGetPerformanceRequest) {
	return useQuery({
		queryKey: ['performance', args.type, args.timeRange],
		queryFn: () => getPerformance(args),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
}
