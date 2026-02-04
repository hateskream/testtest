import { useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query';
import { onBeforeUnmount } from 'vue';

import { type IOptionsRepository, useRepository } from './use-repository';
import { queryClient } from '@/shared/service/query-client';
import { useHistoryManager } from './use-history';
import { getParentId, isChild } from '@/modules/dashboard-group';
import { useLogger } from '@/shared/service/monitoring';

interface IOptions<TData, TSchema, TInput = TSchema> extends IOptionsRepository<TData, TSchema, TInput> {
	saveHistory?: boolean;
	isEphemeral?: boolean;
	transformFirstState?: (parentState: TData) => TData;
}

interface IStateQueries<TData> {
	useStateQuery: () => UseQueryReturnType<TData, Error>;
	useStateMutation: () => ReturnType<typeof useMutation<void, Error, TData>>;
	undo: () => void;
	redo: () => void;
	applyStateToParent: () => void;
}

export function createStateQueries<TData, TSchema, TInput = TSchema>(
	options: IOptions<TData, TSchema, TInput>,
): IStateQueries<TData> {
	const saveHistory = options.saveHistory ?? false;

	const logger = useLogger();

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
		queryFn: async () => {
			if (isInit) {
				return baseRepository.get();
			}

			isInit = true;

			if (!isChild(options.entityId) || !options.isEphemeral) {
				return baseRepository.get();
			}

			const parentStateKey = generateQueryStateKey(options.storageKey, getParentId(options.entityId));

			let state = queryClient.getQueryData<TData>(parentStateKey);
			if (!state) {
				// этого никогда не должно быть
				// нужно залогировать если эта строчка когда-то будет вызвана
				state = await parentRepository.get();
			}

			return options.transformFirstState?.(state) ?? state;

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
			logger.error('Failed to apply state to parent:', { error: err as Error });
		}
	};

	return {
		useStateQuery,
		useStateMutation,
		undo,
		redo,
		applyStateToParent,
	};
}

function generateQueryStateKey(storageKey: string, entityId: string) {
	return [`state-${storageKey}`, entityId];
}
