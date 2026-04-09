import { useQuery } from '@tanstack/vue-query';

import { getDashboards } from '../api';

export function useQueryDashboards() {
	return useQuery({
		queryKey: ['dashboards'],
		queryFn: getDashboards,
	});
}
