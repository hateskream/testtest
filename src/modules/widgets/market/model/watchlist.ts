export interface IWatchlistAction {
	watchlistId: string;
	tabId: string;
	tickerId: string;
}

export interface IWatchlistData {
	watchlistId: string;
	tabId: string;
	name: string;
	tickers: string[];
}

export function isOnWatchlist(data: IWatchlistData, tickerId: string): boolean {
	return data.tickers.includes(tickerId);
}
