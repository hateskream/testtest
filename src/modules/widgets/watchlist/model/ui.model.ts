import type { IWatchlistColumn, IWatchlistTab, TabMenuAction, ITableRowValueType } from '.';

// UI extension for columns with display properties
export interface ITableColumn extends IWatchlistColumn {
	position: number;
	displayColumnName: string;
	displayShortColumnName: string;
	isToggleable: boolean;
	isDraggable: boolean;
	group: {
		order?: number;
		name: string;
	};
	columnName: string;
	type: ITableRowValueType;
}

// UI extension for tabs with state properties
export interface IWatchlistTabUI extends IWatchlistTab {
	isActive: boolean;
	isEditing: boolean;
}

// Tab menu actions with UI labels
export interface ITabMenuActions {
	name: TabMenuAction;
	title: string;
}
