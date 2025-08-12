import { CellType, columnDisplay, columnToCell, type ColumnType } from '@/modules/cell';

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

export interface IActiveTabSort {
	sortTab: string;
	direction: ITableColumnDirection;
	columnName?: string;
	timeframe?: string;
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
	columnType: ColumnType;
	type: CellType;
}

interface INotFullCol {
	isShow: boolean;
	isToggleable: boolean;
	isDraggable: boolean;
	group: {
		order?: number;
		name: string;
	};
	columnType: ColumnType;
}

function createTableColumn(col: INotFullCol): ITableColumn {
	const display = columnDisplay[col.columnType];

	return {
		...col,
		type: columnToCell[col.columnType],
		position: 0,
		displayColumnName: display.name,
		displayShortColumnName: display.shortName,
	};
}

export function buildColumns(cols: INotFullCol[]) {
	return cols.map((item, idx) => ({
		...createTableColumn(item),
		position: idx,
	}));
}

export function getShow(cols: ITableColumn[]) {
	return cols
		.filter(item => item.isShow)
		.map((item, idx) => ({
			...item,
			position: idx,
		}));
}

export type ITableRowValue = string;

export type ITableRow = {
	value: ITableRowValue;
	id: string;
	srcValue: string;
	type: ITableRowValueType;
};
