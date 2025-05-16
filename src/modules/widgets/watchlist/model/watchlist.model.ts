export interface IWatchlistSection {
	id: string;
	name: string;
	isOpen: boolean;
	watchlist: IWatchlistMarkets[];
}

export interface IWatchlistMarkets {
	[marketProp: string]: string;
	id: string;
}
