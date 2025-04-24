import { useQuery } from '@tanstack/vue-query';

import { getNews, type IGetNewsRequest } from '../api';

export function useQueryNews(args: IGetNewsRequest) {
	return useQuery({
		queryKey: [
			'news',
			args.source,
			args.sortBy,
			args.sentiment,
			args.segment,
			args.score,
			args.dateRange,
		],
		queryFn: () => getNews(args),
	});
}
