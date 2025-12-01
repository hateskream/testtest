import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { useGetUnemploymentRate } from '../composables/use-get-unemployment-rate.ts';


export function useQueryUnemploymentRate(
	widgetId: string,
) {


	return useQuery({
		queryKey: computed(() => ['unemployment-rate', widgetId]),
		queryFn: () =>
			useGetUnemploymentRate({
				widgetId: widgetId,
			}),
	});
}
