import type { Cell, ColumnType } from './domain';

export type TableRow<T = Partial<Record<ColumnType, Cell>>> = {
	tickerId: string;
} & T;

// ChangePrice24hPercent
// ChangePrice24h
