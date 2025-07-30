import { useQuery } from '@tanstack/vue-query';

import { getHeatmap } from '../api';

interface IGetHeatMapRequest {
	market: string;
	excludeTickers: string[];
}

export function useQueryHeatmap(req: IGetHeatMapRequest) {
	return useQuery({
		queryKey: ['heatmap', req.market, ...req.excludeTickers],
		queryFn: () => getHeatmap(req),
		refetchOnMount: false,
	});
}
