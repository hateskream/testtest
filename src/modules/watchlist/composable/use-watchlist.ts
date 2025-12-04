import { computed, ref, watch } from 'vue';
import z from 'zod';

import {
	addNewWatchlist as addNewWatchlistModel,
	addTickerInNewWatchlist as addTickerInNewWatchlistModel,
	addTickerInWatchlist,
	createFavoritesWatchlist,
	deleteSectionFromWatchlist as deleteSectionFromWatchlistModel,
	deleteTickerFromWatchlist,
	duplicateWatchlist as duplicateWatchlistModel,
	getActionableWatchlists,
	getDefaultState,
	type IActionableWatchlist,
	type IState,
	type IWatchlist,
	removeWatchlist as removeWatchlistModel,
	renameWatchlist as renameWatchlistModel,
	SpecificSectionType,
} from '../model';
import { MarketType } from '@/modules/market';
import { createStateQueries } from '@/shared/service/data-repo';

const sectionSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.union([z.nativeEnum(MarketType), z.nativeEnum(SpecificSectionType)]),
	tickerIds: z.array(z.string()),
});

const watchlistSchema = z.object({
	id: z.string(),
	name: z.string(),
	sections: z.array(sectionSchema),
	isFavorites: z.boolean(),
});

const stateSchema = z.array(watchlistSchema);

type StateSchemaType = z.infer<typeof stateSchema>;

export function useWatchlist() {
	const {
		useStateQuery,
		useStateMutation,
	} = createStateQueries<IState, StateSchemaType>({
		storageKey: '__WATCHLIST__',
		isSaveChange: true,
		getDefaultState: getDefaultState,
		entityId: 'watchlist',
		schema: stateSchema,
		hydrateFn: (s: StateSchemaType): IState => s,
		rehydrateFn: (s: IState): StateSchemaType => s,
		urlGet: '',
		urlSet: '',
	});

	const { data: watchlistsData } = useStateQuery();
	const { mutate } = useStateMutation();

	const watchlists = ref<IWatchlist[]>([]);

	const actionableWatchlists = computed((): IActionableWatchlist[] =>
		getActionableWatchlists(watchlists.value),
	);

	const selectedTickers = computed(() =>
		actionableWatchlists.value
			.flatMap(item => item.tickers),
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
		const watchlist = watchlists.value.find(w => w.id === tabId);

		if (watchlist && watchlist.isFavorites) {
			throw new Error('Cannot remove favorites watchlist');
		}

		watchlists.value = removeWatchlistModel(watchlists.value, tabId);
	}

	function duplicateWatchlist(tabId: string) {
		watchlists.value = duplicateWatchlistModel(watchlists.value, tabId);
	}

	function addToWatchlist(watchlistId: string, tickerId: string, market: MarketType) {
		watchlists.value = addTickerInWatchlist(watchlists.value, watchlistId, tickerId, market);
	}

	function addTickerInNewWatchlist(tickerId: string, market: MarketType) {
		watchlists.value = addTickerInNewWatchlistModel(watchlists.value, tickerId, market);
	}

	function removeFromWatchlist(watchlistId: string, tickerId: string) {
		watchlists.value = deleteTickerFromWatchlist(watchlists.value, watchlistId, tickerId);
	}

	function deleteSectionFromWatchlist(watchlistId: string, sectionId: string) {
		watchlists.value = deleteSectionFromWatchlistModel(watchlists.value, watchlistId, sectionId);
	}

	// favorites

	function getFavoritesWatchlist() {
		return watchlists.value.find(w => w.isFavorites);
	}

	function addToFavoritesWatchlist(tickerId: string, market: MarketType) {
		let favorites = getFavoritesWatchlist();
		if (!favorites) {
			favorites = createFavoritesWatchlist();

			watchlists.value = [favorites, ...watchlists.value];
		}

		watchlists.value = addTickerInWatchlist(watchlists.value, favorites.id, tickerId, market);
	}

	function removeFromFavoritesWatchlist(tickerId: string) {
		const favorites = getFavoritesWatchlist();
		if (!favorites) {
			return;
		}

		watchlists.value = deleteTickerFromWatchlist(watchlists.value, favorites.id, tickerId);
	}

	function isInFavoritesWatchlist(tickerId: string) {
		const favorites = getFavoritesWatchlist();
		if (!favorites) {
			return false;
		}

		return favorites.sections.some(s => s.tickerIds.includes(tickerId));
	}

	function toggleFavoriteWatchlist(tickerId: string, market: MarketType) {
		if (isInFavoritesWatchlist(tickerId)) {
			removeFromFavoritesWatchlist(tickerId);
		} else {
			addToFavoritesWatchlist(tickerId, market);
		}
	}


	return {
		watchlists,
		actionableWatchlists,
		selectedTickers,

		addNewWatchlist,
		renameWatchlist,
		removeWatchlist,
		duplicateWatchlist,

		deleteSectionFromWatchlist,

		addToWatchlist,
		removeFromWatchlist,
		addTickerInNewWatchlist,

		isInFavoritesWatchlist,
		toggleFavoriteWatchlist,
	};
}
