import { computed, ref } from 'vue';
import { watch } from 'vue';

import {
	type IActionableWatchlist,
	type IWatchlist,
	addNewWatchlist as addNewWatchlistModel,
	renameWatchlist as renameWatchlistModel,
	removeWatchlist as removeWatchlistModel,
	duplicateWatchlist as duplicateWatchlistModel,
	addTickerInWatchlist,
	deleteTickerFromWatchlist,
	getActionableWatchlists,
} from '../model';
import { MarketType } from '@/modules/market';
import { useGetState, useUpdateState } from '../queries';

export function useWatchlist() {
	const { data: watchlistsData } = useGetState();
	const { mutate } = useUpdateState();

	const watchlists = ref<IWatchlist[]>([]);

	const actionableWatchlists = computed((): IActionableWatchlist[] =>
		getActionableWatchlists(watchlists.value),
	);

	watch(watchlistsData, newState => {
		if (newState) {
			watchlists.value = [...newState];
		}
	}, { immediate: true });

	watch(watchlists, () => {
		mutate(watchlists.value);
	}, { deep: true });

	function addNewWatchlist() {
		watchlists.value = addNewWatchlistModel(watchlists.value);
	}

	function renameWatchlist(tabId: string, newName: string) {
		watchlists.value = renameWatchlistModel(watchlists.value, tabId, newName);
	}

	function removeWatchlist(tabId: string) {
		watchlists.value = removeWatchlistModel(watchlists.value, tabId);
	}

	function duplicateWatchlist(tabId: string) {
		watchlists.value = duplicateWatchlistModel(watchlists.value, tabId);
	}

	function addToWatchlist(watchlistId: string, tickerId: string, market: MarketType) {
		watchlists.value = addTickerInWatchlist(watchlists.value, watchlistId, tickerId, market);
	}

	function removeFromWatchlist(watchlistId: string, tickerId: string) {
		watchlists.value = deleteTickerFromWatchlist(watchlists.value, watchlistId, tickerId);
	}

	return {
		watchlists,
		actionableWatchlists,

		addNewWatchlist,
		renameWatchlist,
		removeWatchlist,
		duplicateWatchlist,

		addToWatchlist,
		removeFromWatchlist,
	};
}
