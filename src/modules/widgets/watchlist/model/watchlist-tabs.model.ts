import type { IWatchlistTab, TabMenuAction } from '.';

export interface ITabMenuActions {
	name: TabMenuAction;
	title: string;
}

export interface IWatchlistTabUI extends IWatchlistTab {
	isActive: boolean;
	isEditing: boolean;
}
