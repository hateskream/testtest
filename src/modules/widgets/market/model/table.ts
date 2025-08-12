import type { Cell, ColumnType } from '@/modules/cell';

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

export type TableRow<T = Partial<Record<ColumnType, Cell>>> = {
	tickerId: string;
} & T;
