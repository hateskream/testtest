import { useMutation, useQuery } from '@tanstack/vue-query';

import { useRepository } from '../composables';
import type { IState } from '../model';
import { queryClient } from '@/shared/service/query-client';

const SETTINGS_QUERY_KEY = 'news-settings';

export const useGetState = (widgetId: string) => {
	const repository = useRepository(widgetId);

	return useQuery<IState>({
		queryKey: [SETTINGS_QUERY_KEY, widgetId],
		queryFn: () => repository.get(),
		refetchOnMount: false,
	});
};

export const useUpdateState = (widgetId: string) => {
	const repository = useRepository(widgetId);

	return useMutation<void, Error, IState>({

		mutationFn: (newSettings) => repository.set(newSettings) as unknown as Promise<void>,

		onMutate: async (newSettings) => {

			await queryClient.cancelQueries({ queryKey: [SETTINGS_QUERY_KEY, widgetId] });

			const previousSettings = queryClient.getQueryData<IState>([SETTINGS_QUERY_KEY, widgetId]);

			queryClient.setQueryData<IState>([SETTINGS_QUERY_KEY, widgetId], newSettings);

			return { previousSettings };
		},

		onError: (_err, _newSettings, context) => {
			const ctx = context as { previousSettings?: IState };

			if (ctx?.previousSettings) {
				queryClient.setQueryData([SETTINGS_QUERY_KEY, widgetId], ctx.previousSettings);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [SETTINGS_QUERY_KEY, widgetId] });
		},
	});
};
