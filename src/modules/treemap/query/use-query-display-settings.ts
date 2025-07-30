import { useQuery } from '@tanstack/vue-query';

import { getDisplaySettings } from '../api';

export function useQueryDisplaySettings() {
	return useQuery({
		queryKey: ['heatmap-display-settings'],
		queryFn: () => getDisplaySettings(),
		refetchOnMount: false,
	});
}
