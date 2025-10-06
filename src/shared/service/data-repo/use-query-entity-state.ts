import { useMutation, useQuery } from '@tanstack/vue-query';

import { useRepository, type IOptions } from './use-repository';
import { queryClient } from '@/shared/service/query-client';

export function createStateQueries<TData, TSchema>(options: IOptions<TData, TSchema>) {
	const repository = useRepository(options);

	const STATE_QUERY_KEY = `state-${options.storageKey}`;

	const useStateQuery = () => useQuery<TData>({
		queryKey: [STATE_QUERY_KEY, options.entityId],
		queryFn: () => repository.get(),
		refetchOnMount: false,
	});

	const useStateMutation = () => useMutation<void, Error, TData>({
		mutationFn: (newSettings) => repository.set(newSettings) as Promise<void>,

		onMutate: async (newSettings) => {
			await queryClient.cancelQueries({ queryKey: [STATE_QUERY_KEY, options.entityId] });

			const previousSettings = queryClient.getQueryData<TData>([STATE_QUERY_KEY, options.entityId]);

			queryClient.setQueryData<TData>([STATE_QUERY_KEY, options.entityId], newSettings);

			return { previousSettings };
		},

		onError: (_err, _newSettings, context) => {
			const ctx = context as { previousSettings?: TData };
			if (ctx?.previousSettings) {
				queryClient.setQueryData([STATE_QUERY_KEY, options.entityId], ctx.previousSettings);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [STATE_QUERY_KEY, options.entityId] });
		},
	});

	return { useStateQuery, useStateMutation };
};
