import {
	ColumnType,
	type ISymbolCell,
	type TableRow,
	type ITableColumn,
	type INumberCell,
	buildColumns,
} from '@/modules/cell';

export type CryptoCEXTableRow = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;
	[ColumnType.PriceCurrent]: INumberCell;
}>;

export type CryptoDEXTableRow = TableRow<{
	[ColumnType.Symbol]: ISymbolCell;
	[ColumnType.PriceCurrent]: INumberCell;
}>;


export const CRYPTO_CEX_COLUMNS: ITableColumn[] =
	buildColumns(
		[
			{
				columnType: ColumnType.Symbol,
				isDraggable: false,
				isShow: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.MaxSupply,
				isShow: true,
				isDraggable: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.Volume24h,
				isShow: true,
				isDraggable: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.Volume24h,
				isShow: true,
				isDraggable: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.PriceCurrent,
				isDraggable: false,
				isShow: true,
				groupOrder: 0,
			},
		],
	);


export const CRYPTO_DEX_COLUMNS: ITableColumn[] =
	buildColumns(
		[
			{
				columnType: ColumnType.Symbol,
				isDraggable: false,
				isShow: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.PriceCurrent,
				isDraggable: false,
				isShow: true,
				groupOrder: 0,
			},
		],
	);
