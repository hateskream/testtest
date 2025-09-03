import { computed, onMounted, onUnmounted, ref } from 'vue';
import z from 'zod';
import { watch } from 'vue';

import { type IWatchlist, addNewWatchlist as addNewWatchlistModel } from '../model';
import { MarketType } from '@/modules/market';
import { Consumer } from '@/shared/service/event-bus';
import { useGetState, useUpdateState } from '../queries';

export interface ITickerAction {
	tickerType: MarketType;
	tabId: string;
	tickerId: string;
}

type Event = 'subscribeAddToWatchlist' | 'removeFromWatchlist';

const payloadSchema = z.object({
	tickerId: z
		.string()
		.min(1, { message: 'tickerId is required and must be a non-empty string' }),
	tickerType: z.nativeEnum(
		MarketType,
		{ message: 'tickerType is required and must be a MarketType' },
	),
	watchlistId: z
		.string()
		.min(1, { message: 'watchlistId is required and must be a non-empty string' }),
});

type IPayload = z.infer<typeof payloadSchema>;

type Events = Record<Event, IPayload>;

const consumer = new Consumer<Events>(['subscribeAddToWatchlist', 'removeFromWatchlist']);

export function useWatchlist() {
	consumer.on('subscribeAddToWatchlist', subscribeAddToWatchlist);
	consumer.on('removeFromWatchlist', subscribeRemoveFromWatchlist);

	const { data: watchlistsData } = useGetState();
	const { mutate } = useUpdateState();

	const watchlists = ref<IWatchlist[]>([]);

	watch(watchlistsData, newState => {
		if (newState) {
			watchlists.value = [...newState];
		}
	}, { immediate: true });

	watch(watchlists, () => {
		mutate(watchlists.value);
	}, { deep: true });

	onUnmounted(() => {
		consumer.off('subscribeAddToWatchlist', subscribeAddToWatchlist);
		consumer.off('removeFromWatchlist', subscribeRemoveFromWatchlist);
	});

	function addNewWatchlist() {
		watchlists.value = addNewWatchlistModel(watchlists.value);
	}

	function renameWatchlist(tabId: string, newName: string) {

	}

	function removeWatchlist(tabId: string) {

	}

	function duplicateWatchlist(tabId: string) {

	}

	function subscribeAddToWatchlist(payload: IPayload) {
		// if (!isPayloadAccept(payload)) {
		// 	return;
		// }

		// const { tickerType, tickerId, tabId } = payload;

		// state.value = addTickerInTab(state.value, tickerId, tickerType, tabId);
	}

	function addToWatchlist(_: ITickerAction) {
		// if (activeTab.value === null) {
		// 	return;
		// }

		// state.value = addTickerInTab(
		// 	state.value,
		// 	tickerId,
		// 	tickerType,
		// 	activeTab.value.id,
		// );
	}

	function subscribeRemoveFromWatchlist(payload: IPayload) {
		// if (!isPayloadAccept(payload)) {
		// 	return;
		// }

		// const { tickerType, tickerId, tabId } = payload;

		// state.value = deleteTickerInTab(state.value, tickerId, tickerType, tabId);
	}

	function removeFromWatchlist(_: ITickerAction) {
		// if (activeTab.value === null) {
		// 	return;
		// }

		// state.value = deleteTickerInTab(
		// 	state.value,
		// 	tickerId,
		// 	tickerType,
		// 	activeTab.value.id,
		// );
	}

	function isPayloadAccept(input: unknown): boolean {
		return true;
		// try {
		// 	const payload = payloadSchema.parse(input);

		// 	const { watchlistId } = payload;

		// 	if (watchlistId !== widgetId) {
		// 		return false;
		// 	}

		// 	return true;
		// } catch (error) {
		// 	if (error instanceof z.ZodError) {
		// 		// eslint-disable-next-line no-console
		// 		console.error('Validation failed:', error.issues);
		// 	}
		// 	return false;
		// }
	}

	return {
		watchlists,

		addNewWatchlist,
		renameWatchlist,
		removeWatchlist,
		duplicateWatchlist,

		addToWatchlist,
		removeFromWatchlist,
	};
}
