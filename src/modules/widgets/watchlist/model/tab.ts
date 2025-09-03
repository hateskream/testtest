import type { IWatchlist } from '@/modules/watchlist';

export interface ITab {
	id: string;
	name: string;
	isActive: boolean;
}

export enum TabAction {
	Rename = 'rename',
	Duplicate = 'duplicate',
	AddSymbolsToList = 'addSymbolsToList',
	Delete = 'delete',
}

export const tabActionToTitle: Readonly<Record<TabAction, string>> = {
	[TabAction.Rename]: 'Rename',
	[TabAction.Duplicate]: 'Duplicate',
	[TabAction.AddSymbolsToList]: 'Add symbols to list',
	[TabAction.Delete]: 'Delete',
};


export function getTabsFromWatchlists(watchlists: IWatchlist[], activeTableId: string | null): ITab[] {
	return activeTableId
		? watchlists
			.map((watchlist) => ({
				id: watchlist.id,
				name: watchlist.name,
				isActive: watchlist.id === activeTableId,
			}))
		: [];
}
