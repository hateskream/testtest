import { useMutation, useQuery } from '@tanstack/vue-query';

import { useRepository } from '../composables';
import type { ISettings } from '../model';
import { queryClient } from '@/shared/service/query-client';

const SETTINGS_QUERY_KEY = 'fear-greed-settings';

export const useGetSettings = (widgetId: string) => {
	const repository = useRepository(widgetId);

	return useQuery<ISettings>({
		queryKey: [SETTINGS_QUERY_KEY, widgetId],
		queryFn: () => repository.get(),
		refetchOnMount: false,
	});
};

export const useUpdateSettings = (widgetId: string) => {
	const repository = useRepository(widgetId);

	return useMutation<void, Error, ISettings>({

		mutationFn: (newSettings) => repository.set(newSettings),

		onMutate: async (newSettings) => {

			await queryClient.cancelQueries({ queryKey: [SETTINGS_QUERY_KEY, widgetId] });

			const previousSettings = queryClient.getQueryData<ISettings>([SETTINGS_QUERY_KEY, widgetId]);

			queryClient.setQueryData<ISettings>([SETTINGS_QUERY_KEY, widgetId], newSettings);

			return { previousSettings };
		},

		onError: (_err, _newSettings, context) => {
			const ctx = context as { previousSettings?: ISettings };

			if (ctx?.previousSettings) {
				queryClient.setQueryData([SETTINGS_QUERY_KEY, widgetId], ctx.previousSettings);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [SETTINGS_QUERY_KEY, widgetId] });
		},
	});
};
