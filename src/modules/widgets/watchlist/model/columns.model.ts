import type { ColumnType } from '../const';

// Base business model for watchlist columns
export interface IWatchlistColumn {
	id: string;
	columnType: ColumnType;
	isShow: boolean;
	order: number;
	sort?: string;
	width?: number;
}
