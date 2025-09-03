export interface IWatchlistAction {
	watchlistId: string;
	tickerId: string;
}

export interface IWatchlistData {
	watchlistId: string;
	name: string;
	tickers: string[];
}

export function isOnWatchlist(data: IWatchlistData, tickerId: string): boolean {
	return data.tickers.includes(tickerId);
}
