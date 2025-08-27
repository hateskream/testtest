import { computed, onUnmounted, ref } from 'vue';

import { useUsecase } from '@/modules/dashboard-group/core';
import { getPublicState, type IPublicState, type IState } from '../model';
import { useRepository } from './use-repository';
import { queryClient } from '@/shared/service/query-client';
import { getStateCacheKey } from '../queries';

export function useWatchlistPublic() {
	const dashboardUc = useUsecase();

	const watchlistMap = ref<Map<string, IPublicState[]>>(new Map());

	const wachlists = computed(() => Array.from(watchlistMap.value.values()).flatMap(states => states));

	const updateCacheSubscribers: (() => void)[] = [];

	onCreated();

	onUnmounted(() => {
		updateCacheSubscribers.forEach(unsubscribe => unsubscribe());
	});

	async function onCreated() {
		const widgetIds = await getWidgetIds();

		const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
			widgetIds.forEach((widgetId) => {
				const cacheKey = getStateCacheKey(widgetId);

				if (
					cacheKey.length === event.query.queryKey.length &&
					event.type === 'updated' &&
					event.query.queryKey[0] === cacheKey[0] &&
					event.query.queryKey[1] === cacheKey[1]
				) {
					const newState = event.query.state.data as IState;

					const publicStates = getPublicState(newState, widgetId);

					if (watchlistMap.value.has(widgetId)) {
						watchlistMap.value.set(widgetId, []);
					}

					publicStates.forEach(s => {
						if (watchlistMap.value.has(s.watchlistId)) {
							watchlistMap.value.get(s.watchlistId)?.push(s);
						} else {
							watchlistMap.value.set(s.watchlistId, [s]);
						}
					});
				}
			});

			updateCacheSubscribers.push(unsubscribe);
		});


		fetchPublicStates(widgetIds);
	}

	async function fetchPublicState(widgetId: string): Promise<IPublicState[]> {
		let state: IState | null = null;

		const cachedState = queryClient.getQueryData<IState>(getStateCacheKey(widgetId));

		if (cachedState) {
			state = cachedState;
		} else {
			const repo = useRepository(widgetId);

			state = await repo.get();
		}

		return getPublicState(state, widgetId);
	}

	async function fetchPublicStates(widgetIds: string[]) {
		const allStates = await Promise.allSettled(widgetIds.map(fetchPublicState));


		allStates
			.forEach(state => {
				if (state.status === 'rejected') {
					return;
				}

				state.value.forEach(s => {
					if (watchlistMap.value.has(s.watchlistId)) {
						watchlistMap.value.get(s.watchlistId)?.push(s);
					} else {
						watchlistMap.value.set(s.watchlistId, [s]);
					}
				});
			});
	}

	async function getWidgetIds(): Promise<string[]> {
		try {
			const { ids } = await dashboardUc
				.GetAllWidgetIds()
				.execute({
					widgetType: 'watchlist',
				});

			return ids;
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
			return [];
		}
	}

	return {
		wachlists,
	};
}
