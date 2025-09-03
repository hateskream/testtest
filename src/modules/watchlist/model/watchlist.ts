import { v4 as uuidv4 } from 'uuid';

import { addTicker, deleteTicker, type ISection } from './section';
import { updateById } from '@/shared/lib';
import type { MarketType } from '@/modules/market';

export type IState = IWatchlist[];

export interface IWatchlist {
	id: string;
	name: string;
	sections: ISection[];
}

const MAX_WATCHLIST_COUNT = 10;

export function getDefaultState(): IWatchlist[] {
	return [
		createEmptyWatchlist(),
	];
}

export function addNewWatchlist(watchlists: IWatchlist[]): IWatchlist[] {
	if (watchlists.length >= MAX_WATCHLIST_COUNT) {
		return watchlists;
	}

	return [
		...watchlists,
		createEmptyWatchlist(),
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

function createEmptyWatchlist(): IWatchlist {
	return {
		id: uuidv4(),
		name: 'Favorites',
		sections: [],
	};
}

function duplicate(watchlist: IWatchlist): IWatchlist {
	return {
		...watchlist,
		id: uuidv4(),
	};
}
