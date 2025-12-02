import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { useGetNonfarmPayrolls } from '../composables/use-get-nonfarm-payrolls.ts';


export function useQueryNonfarmPayrolls(
	widgetId: string,
) {


	return useQuery({
		queryKey: computed(() => ['nonfarm-payrolls', widgetId]),
		queryFn: () =>
			useGetNonfarmPayrolls({
				widgetId: widgetId,
			}),
	});
}
