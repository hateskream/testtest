import { computed, onUnmounted, ref } from 'vue';
import z from 'zod';

// import { useUsecase } from '@/modules/dashboard-group/core';
// import { type IState } from '../model';
// import { useRepository } from './use-repository';
// import { queryClient } from '@/shared/service/query-client';
// import { getStateCacheKey } from '../queries';
import { Consumer } from '@/shared/service/event-bus';

type WidgetId = string;

type Event = 'addWidget' | 'removeWidget';

const payloadSchema = z.object({
	widgetType: z
		.string()
		.min(1, { message: 'widgetType is required and must be a non-empty string' }),
	widgetId: z
		.string()
		.min(1, { message: 'watchlistId is required and must be a non-empty string' }),
});

type IPayload = z.infer<typeof payloadSchema>;

type Events = Record<Event, IPayload>;

export function useWatchlistPublic() {
	const consumer = new Consumer<Events>(['addWidget', 'removeWidget']);

	// consumer.on('addWidget', subscribeToAddWidget);
	// consumer.on('removeWidget', subscribeToRemoveWidget);

	// const dashboardUc = useUsecase();

	// const watchlistMap = ref<Map<WidgetId, IPublicState[]>>(new Map());

	const wachlists = computed(() =>
		// Array
		// 	.from(watchlistMap.value.values())
		// 	.flatMap(states => states),
		[],
	);

	// let updateCacheSubscribe: () => void = () => {};

	// onCreated();

	onUnmounted(() => {
		// updateCacheSubscribe();

		// consumer.off('addWidget', subscribeToAddWidget);
		// consumer.off('removeWidget', subscribeToRemoveWidget);
	});

	// function onCreated() {
	// 	updateWidget();
	// }

	// async function updateWidget() {
	// 	const widgetIds = await getWidgetIds();

	// 	const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
	// 		widgetIds.forEach((widgetId) => {
	// 			const cacheKey = getStateCacheKey(widgetId);

	// 			if (
	// 				cacheKey.length === event.query.queryKey.length &&
	// 				event.type === 'updated' &&
	// 				event.query.queryKey[0] === cacheKey[0] &&
	// 				event.query.queryKey[1] === cacheKey[1]
	// 			) {
	// 				const newState = event.query.state.data as IState;

	// 				if (!newState) {
	// 					return;
	// 				}
	// 				const publicStates = getPublicState(newState, widgetId);

	// 				if (watchlistMap.value.has(widgetId)) {
	// 					watchlistMap.value.set(widgetId, []);
	// 				}

	// 				publicStates.forEach(s => {
	// 					if (watchlistMap.value.has(s.watchlistId)) {
	// 						watchlistMap.value.get(s.watchlistId)?.push(s);
	// 					} else {
	// 						watchlistMap.value.set(s.watchlistId, [s]);
	// 					}
	// 				});
	// 			}
	// 		});

	// 	});

	// 	updateCacheSubscribe = unsubscribe;

	// 	fetchStates(widgetIds);
	// }

	// async function subscribeToAddWidget(payload: IPayload) {
	// 	if (isPayloadAccept(payload)) {
	// 		updateWidget();
	// 	}
	// }

	// async function subscribeToRemoveWidget(payload: IPayload) {
	// 	if (isPayloadAccept(payload)) {
	// 		watchlistMap.value.delete(payload.widgetId);
	// 	}
	// }

	// async function fetchState(widgetId: string) {
	// 	let state: IState | null = null;

	// 	const cachedState = queryClient.getQueryData<IState>(getStateCacheKey(widgetId));

	// 	if (cachedState) {
	// 		state = cachedState;
	// 	} else {
	// 		const repo = useRepository(widgetId);

	// 		state = await repo.get();
	// 	}

	// 	return {
	// 		state,
	// 		widgetId,
	// 	};
	// }

	// async function fetchStates(widgetIds: string[]) {
	// 	const allStates = await Promise.allSettled(widgetIds.map(fetchState));

	// 	allStates
	// 		.forEach(state => {
	// 			if (state.status === 'rejected') {
	// 				return;
	// 			}

	// 			getPublicState(state.value.state, state.value.widgetId)
	// 				.forEach(s => {
	// 					if (watchlistMap.value.has(s.watchlistId)) {
	// 						watchlistMap.value.get(s.watchlistId)?.push(s);
	// 					} else {
	// 						watchlistMap.value.set(s.watchlistId, [s]);
	// 					}
	// 				});

	// 		});
	// }

	// async function getWidgetIds(): Promise<string[]> {
	// 	try {
	// 		const { ids } = await dashboardUc
	// 			.GetAllWidgetIds()
	// 			.execute({
	// 				widgetType: 'watchlist',
	// 			});

	// 		return ids;
	// 	} catch (error) {
	// 		// eslint-disable-next-line no-console
	// 		console.error(error);
	// 		return [];
	// 	}
	// }

	// function isPayloadAccept(input: unknown): boolean {
	// 	try {
	// 		const payload = payloadSchema.parse(input);

	// 		const { widgetType } = payload;

	// 		if (widgetType !== 'watchlist') {
	// 			return false;
	// 		}

	// 		return true;
	// 	} catch (error) {
	// 		if (error instanceof z.ZodError) {
	// 			// eslint-disable-next-line no-console
	// 			console.error('Validation failed:', error.issues);
	// 		}
	// 		return false;
	// 	}
	// }

	return {
		wachlists,
	};
}
