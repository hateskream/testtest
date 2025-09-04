import { useMutation, useQuery } from '@tanstack/vue-query';

import { useRepository } from '../composables';
import type { IState } from '../model';
import { queryClient } from '@/shared/service/query-client';

const SETTINGS_QUERY_KEY = 'watchlist-widget-settings';

export function getStateCacheKey(widgetId: string) {
	return [SETTINGS_QUERY_KEY, widgetId];
}

export const useGetState = (widgetId: string) => {
	const repository = useRepository(widgetId);

	return useQuery<IState | null>({
		queryKey: getStateCacheKey(widgetId),
		queryFn: () => repository.get(),
		refetchOnMount: false,
	});
};

export const useUpdateState = (widgetId: string) => {
	const repository = useRepository(widgetId);

	return useMutation<void, Error, IState>({

		mutationFn: (newSettings) => repository.set(newSettings) as unknown as Promise<void>,

		onMutate: async (newSettings) => {

			await queryClient.cancelQueries({ queryKey: getStateCacheKey(widgetId) });

			const previousSettings = queryClient.getQueryData<IState>(getStateCacheKey(widgetId));

			queryClient.setQueryData<IState>(getStateCacheKey(widgetId), newSettings);

			return { previousSettings };
		},

		onError: (_err, _newSettings, context) => {
			const ctx = context as { previousSettings?: IState };

			if (ctx?.previousSettings) {
				queryClient.setQueryData(getStateCacheKey(widgetId), ctx.previousSettings);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: getStateCacheKey(widgetId) });
		},
	});
};
