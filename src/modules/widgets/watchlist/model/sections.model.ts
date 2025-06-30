import type { MarketType, IWatchlistRow } from '.';

// Watchlist section containing grouped rows
export interface IWatchlistSection {
	id: string;
	name: string;
	order: number;
	isOpen: boolean;
	type?: MarketType;
	rows: IWatchlistRow[];
	totalCount: number;
}
