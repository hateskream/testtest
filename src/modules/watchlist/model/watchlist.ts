import { v4 as uuidv4 } from 'uuid';

import { addTicker, deleteSection, deleteTicker, type ISection } from './section';
import { updateById } from '@/shared/lib';
import type { MarketType } from '@/modules/market';

export type IState = IWatchlist[];

export interface IWatchlist {
	id: string;
	name: string;
	sections: ISection[];
	isFavorites: boolean;
}

export interface IActionableWatchlist {
	watchlistId: string;
	name: string;
	tickers: string[];
	isFavorites: boolean;
}

const MAX_WATCHLIST_COUNT = 10;

export function getDefaultState(): IWatchlist[] {
	return [
		createFavoritesWatchlist(),
	];
}

export function getActionableWatchlists(watchlists: IWatchlist[]): IActionableWatchlist[] {
	return watchlists
		.map(({ id, name, sections, isFavorites }) => ({
			watchlistId: id,
			name,
			isFavorites,
			tickers: sections
				.flatMap(section => section.tickerIds),
		}));
}

export function addNewWatchlist(watchlists: IWatchlist[]): IWatchlist[] {
	if (watchlists.length >= MAX_WATCHLIST_COUNT) {
		return watchlists;
	}

	return [
		...watchlists,
		createFavoritesWatchlist(),
	];
}

export function duplicateWatchlist(watchlists: IWatchlist[], watchlistId: string): IWatchlist[] {
	const indexWatchlist = watchlists.findIndex(w => w.id === watchlistId);
	if (indexWatchlist === -1) {
		return watchlists;
	}

	return [
		...watchlists.slice(0, indexWatchlist + 1),
		duplicate(watchlists[indexWatchlist]),
		...watchlists.slice(indexWatchlist + 1),
	];
}

export function renameWatchlist(watchlists: IWatchlist[], watchlistId: string, newName: string): IWatchlist[] {
	return updateById(
		watchlists,
		watchlistId,
		watchlist => ({
			...watchlist,
			name: newName,
		}));
}

export function removeWatchlist(watchlists: IWatchlist[], watchlistId: string): IWatchlist[] {
	return watchlists.filter(w => w.id !== watchlistId);
}

export function addTickerInNewWatchlist(
	watchlists: IWatchlist[],
	tickerId: string,
	market: MarketType,
): IWatchlist[] {
	return [
		...watchlists,
		{
			...createEmptyWatchlist(),
			sections: addTicker(
				[],
				tickerId, market,
			),
		},
	];
}

export function addTickerInWatchlist(
	watchlists: IWatchlist[],
	watchlistId: string,
	tickerId: string,
	market: MarketType,
): IWatchlist[] {
	return updateById(
		watchlists,
		watchlistId,
		watchlist => ({
			...watchlist,
			sections: addTicker(
				watchlist.sections,
				tickerId, market,
			),
		}));
}

export function deleteTickerFromWatchlist(
	watchlists: IWatchlist[],
	watchlistId: string,
	tickerId: string,
): IWatchlist[] {
	return updateById(
		watchlists,
		watchlistId,
		watchlist => ({
			...watchlist,
			sections: deleteTicker(
				watchlist.sections,
				tickerId,
			),
		}));
}

export function deleteSectionFromWatchlist(
	watchlists: IWatchlist[],
	watchlistId: string,
	sectionId: string,
): IWatchlist[] {
	return updateById(
		watchlists,
		watchlistId,
		watchlist => ({
			...watchlist,
			sections: deleteSection(
				watchlist.sections,
				sectionId,
			),
		}));
}

export function createFavoritesWatchlist(): IWatchlist {
	return {
		id: uuidv4(),
		name: 'Favorites',
		sections: [],
		isFavorites: true,
	};
}

function createEmptyWatchlist(): IWatchlist {
	return {
		id: uuidv4(),
		name: 'Watchlist',
		sections: [],
		isFavorites: false,
	};
}

function duplicate(watchlist: IWatchlist): IWatchlist {
	return {
		...watchlist,
		id: uuidv4(),
	};
}

export interface IWatchlistData {
	watchlistId: string;
	name: string;
	tickers: string[];
	isFavorites: boolean;
}

export function isOnWatchlist(data: IWatchlistData, tickerId: string): boolean {
	return data.tickers.includes(tickerId);
}

export function isOnFavoritesWatchlist(watchlists: IWatchlistData[], tickerId: string): boolean {
	const favorites = watchlists.find(w => w.isFavorites);

	if (!favorites) {
		return false;
	}

	return favorites.tickers.includes(tickerId);
}

export interface IWatchlistAction {
	watchlistId: string;
	tickerId: string;
}
