import type { MarketType } from './watchlist.model';

export type ITableRowValueType =
	| 'image'
	| 'image-string'
	| 'string'
	| 'number'
	| 'percent'
	| 'date';
export type ITableColumnDirection = 0 | 1 | -1;

export interface IActiveSortColumn {
	columnName: string;
	direction: ITableColumnDirection;
}

export interface ITableColumn {
	position: number;
	isShow: boolean;
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

export type ITableRowValue = string;

export type ITableRow = {
	value: ITableRowValue;
	id: string;
	srcValue: string | string[];
	domain: string;
	market: MarketType;
	type: ITableRowValueType;
};
