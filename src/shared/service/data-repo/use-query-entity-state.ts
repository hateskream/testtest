import { useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query';
import { onBeforeUnmount } from 'vue';

import { useRepository, type IOptionsRepository } from './use-repository';
import { queryClient } from '@/shared/service/query-client';
import { useHistoryManager } from './use-history';
import { getParentId, isChild } from '@/modules/dashboard-group';

interface IOptions<TData, TSchema> extends IOptionsRepository<TData, TSchema> {
	saveHistory?: boolean;
	isEphemeral?: boolean;
}

interface IStateQueries<TData> {
	useStateQuery: () => UseQueryReturnType<TData, Error>;
	useStateMutation: () => ReturnType<typeof useMutation<void, Error, TData>>;
	undo: () => void;
	redo: () => void;
	applyStateToParent: () => void;
}

export function createStateQueries<TData, TSchema>(options: IOptions<TData, TSchema>): IStateQueries<TData> {
	const saveHistory = options.saveHistory ?? false;

	const baseRepository = useRepository(options);
	const parentRepository = useRepository({
		...options,
		entityId: getParentId(options.entityId),
		isSaveChange: false,
	});

	const STATE_QUERY_KEY = generateQueryStateKey(options.storageKey, options.entityId);

	const {
		pushToHistory,
		undoStack,
		undo,
		redo,
	} = useHistoryManager<TData>({
		key: STATE_QUERY_KEY,
		repository: (data) => baseRepository.set(data) as Promise<void>,
		maxHistory: 20,
	});

	let isInit = false;

	onBeforeUnmount(() => {
		if (options.isEphemeral) {
			queryClient.removeQueries({ queryKey: STATE_QUERY_KEY });
		}
	});

	const useStateQuery = () => useQuery<TData>({
		queryKey: STATE_QUERY_KEY,
		queryFn: () => {
			if (isInit) {
				return baseRepository.get();
			}

			isInit = true;

			if (!isChild(options.entityId) || !options.isEphemeral) {
				return baseRepository.get();
			}

			const parentStateKey = generateQueryStateKey(options.storageKey, getParentId(options.entityId));

			const state = queryClient.getQueryData<TData>(parentStateKey);
			if (!state) {
				// этого никогда не должно быть
				// нужно залогировать если эта строчка когда-то будет вызвана
				return parentRepository.get();
			}

			return state;

		},
		refetchOnMount: false,
	});

	const useStateMutation = () => useMutation<void, Error, TData>({
		mutationFn: (newSettings) => baseRepository.set(newSettings) as Promise<void>,

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
	});

	const applyStateToParent = async () => {
		if (!isChild(options.entityId)) {
			return;
		}

		const state = queryClient.getQueryData<TData>(STATE_QUERY_KEY);
		if (!state) {
			return;
		}

		const parentStateKey = generateQueryStateKey(options.storageKey, getParentId(options.entityId));

		try {
			await parentRepository.set(state);

			queryClient.invalidateQueries({ queryKey: parentStateKey, refetchType: 'active' });
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error('Failed to apply state to parent:', err);
		}
	};

	return {
		useStateQuery,
		useStateMutation,
		undo,
		redo,
		applyStateToParent,
	};
};

function generateQueryStateKey(storageKey: string, entityId: string) {
	return [`state-${storageKey}`, entityId];
}
