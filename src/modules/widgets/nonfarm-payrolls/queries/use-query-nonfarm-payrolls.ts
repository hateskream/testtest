import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { useGetNonfarmPayrolls } from '../composables/use-get-nonfarm-payrolls.ts';


export function useQueryNonfarmPayrolls(
	widgetId: string,
) {


	return useQuery({
		queryKey: computed(() => ['unemployment-rate', widgetId]),
		queryFn: () =>
			useGetNonfarmPayrolls({
				widgetId: widgetId,
			}),
	});
}
