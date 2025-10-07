import { useMutation, useQuery } from '@tanstack/vue-query';

import { useRepository, type IOptionsRepository } from './use-repository';
import { queryClient } from '@/shared/service/query-client';
import { useHistoryManager } from './use-history';

interface IOptions<TData, TSchema> extends IOptionsRepository<TData, TSchema> {
	saveHistory?: boolean;
}

export function createStateQueries<TData, TSchema>(options: IOptions<TData, TSchema>) {
	const saveHistory = options.saveHistory ?? false;

	const repository = useRepository(options);

	const STATE_QUERY_KEY = [`state-${options.storageKey}`, options.entityId];

	const {
		pushToHistory,
		undoStack,
		undo,
		redo,
	} = useHistoryManager<TData>({
		key: STATE_QUERY_KEY,
		repository: (data) => repository.set(data) as Promise<void>,
		maxHistory: 20,
	});

	const useStateQuery = () => useQuery<TData>({
		queryKey: STATE_QUERY_KEY,
		queryFn: () => repository.get(),
		refetchOnMount: false,
	});

	const useStateMutation = () => useMutation<void, Error, TData>({
		mutationFn: (newSettings) => repository.set(newSettings) as Promise<void>,

		onMutate: async (newSettings) => {
			await queryClient.cancelQueries({ queryKey: STATE_QUERY_KEY });

			const previousSettings = queryClient.getQueryData<TData>(STATE_QUERY_KEY);

			if (previousSettings && saveHistory) {
				pushToHistory(previousSettings);
			}

			queryClient.setQueryData<TData>(STATE_QUERY_KEY, newSettings);

			return { previousSettings };
		},

		onError: (_err, _newSettings, context) => {
			const ctx = context as { previousSettings?: TData };
			if (ctx?.previousSettings) {
				queryClient.setQueryData(STATE_QUERY_KEY, ctx.previousSettings);

				if (saveHistory) {
					undoStack.value.pop();
				}
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: STATE_QUERY_KEY });
		},
	});

	return {
		useStateQuery,
		useStateMutation,
		undo,
		redo,
	};
};
