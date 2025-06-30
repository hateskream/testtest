import type { ITableColumnDirection } from './core.model';

// Base business model for watchlist columns
export interface IWatchlistColumn {
	id: string;
	columnType: string;
	isShow: boolean;
	order: number;
	sort?: string;
	width?: number;
}

// Active sort column configuration
export interface IActiveSortColumn {
	columnName: string;
	direction: ITableColumnDirection;
}
