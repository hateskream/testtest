import type { Cell, ColumnType } from '@/modules/cell';

export type ITableColumnDirection = 0 | 1 | -1;

export interface IActiveTabSort {
	sortTab: string;
	direction: ITableColumnDirection;
}

export type TableRow<T = Partial<Record<ColumnType, Cell>>> = {
	tickerId: string;
} & T;
