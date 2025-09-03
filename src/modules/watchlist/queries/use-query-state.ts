import { useMutation, useQuery } from '@tanstack/vue-query';

import { useRepository } from '../composable';
import type { IState } from '../model';
import { queryClient } from '@/shared/service/query-client';

const SETTINGS_QUERY_KEY = 'watchlist-settings';

export function getStateCacheKey() {
	return [SETTINGS_QUERY_KEY];
}

export const useGetState = () => {
	const repository = useRepository();

	return useQuery<IState>({
		queryKey: getStateCacheKey(),
		queryFn: () => repository.get(),
		refetchOnMount: false,
	});
};

export const useUpdateState = () => {
	const repository = useRepository();

	return useMutation<void, Error, IState>({

		mutationFn: (newSettings) => repository.set(newSettings) as unknown as Promise<void>,

		onMutate: async (newSettings) => {

			await queryClient.cancelQueries({ queryKey: getStateCacheKey() });

			const previousSettings = queryClient.getQueryData<IState>(getStateCacheKey());

			queryClient.setQueryData<IState>(getStateCacheKey(), newSettings);

			return { previousSettings };
		},

		onError: (_err, _newSettings, context) => {
			const ctx = context as { previousSettings?: IState };

			if (ctx?.previousSettings) {
				queryClient.setQueryData(getStateCacheKey(), ctx.previousSettings);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: getStateCacheKey() });
		},
	});
};
