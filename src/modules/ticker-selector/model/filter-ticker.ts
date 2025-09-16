import {
	SymbolType,
	type ColumnType,
	type ISymbolCell,
	type SymbolDto,
	type TableRow,
	type TableRowDto,
} from '@/modules/cell';

export type TickerDto = TableRowDto<{
	[ColumnType.Symbol]: SymbolDto;
}>;

export type TickerRow = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;
}>;


export const FilterListType = {
	All: 'all',
	Selected: 'selected',
} as const;

export type FilterListType = (typeof FilterListType)[keyof typeof FilterListType];

export type ITickerMapped =
	| {
		srcImage?: string | null;
		name?: string | null;
		ticker?: string | null;
		symbolType?: SymbolType | null;
		tickerId: string;
	}
	| {
		srcImage: [string | null | undefined, string | null | undefined];
		name?: string | null;
		ticker?: string | null;
		symbolType?: SymbolType.Forex | null;
		tickerId: string;
	};

export interface ITickerSelectAction {
	isSelected: boolean;
	tickerId: string;
}

export interface ITickerEmits {
	(e: 'select', item: string): void;
	(e: 'unselect', item: string): void;
	(e: 'selectAll', item: string[]): void;
	(e: 'unselectAll', item: string[]): void;
}


export const SymbolToName: Record<SymbolType, string> = {
	[SymbolType.Index]: 'Index',
	[SymbolType.Commodity]: 'Commodity',
	[SymbolType.Stock]: 'Stock',
	[SymbolType.Crypto]: 'Cryptocurrency',
	[SymbolType.Forex]: 'Forex',
	[SymbolType.PlaneText]: 'Text',
};
