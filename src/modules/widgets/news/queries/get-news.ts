import { useQuery } from '@tanstack/vue-query';

import { getNews } from '../api';

export function useQueryNews() {
	return useQuery({
		queryKey: [
			'news',
		],
		queryFn: () => getNews(),
		refetchOnMount: false,
	});
}
