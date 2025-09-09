import type { Cell, ColumnType } from './domain';

export type RowCells = Partial<Record<ColumnType, Cell>>;

export type ColumnWithoutSymbol = Exclude<ColumnType, ColumnType.Symbol>;

export type TableRow<T = RowCells> = {
	tickerId: string;
} & T;
