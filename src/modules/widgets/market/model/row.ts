import type { Cell, ColumnType } from '@/modules/cell';

export type TableRow<T = Partial<Record<ColumnType, Cell>>> = {
	tickerId: string;
} & T;
