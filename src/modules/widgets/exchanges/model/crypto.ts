import {
	buildColumns,
	ColumnType,
	type INumberCell,
	type ISymbolCell,
	type ITableColumn,
	type TableRow,
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
				columnType: ColumnType.Volume24h,
				isShow: true,
				isDraggable: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.Volume24hNorm,
				isShow: true,
				isDraggable: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.Coins,
				isShow: true,
				isDraggable: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.Pairs,
				isShow: true,
				isDraggable: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.Country,
				isShow: true,
				isDraggable: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.Launched,
				isShow: true,
				isDraggable: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.Incentive,
				isShow: true,
				isDraggable: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.DEXRank,
				isShow: true,
				isDraggable: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.TrustScore,
				isShow: true,
				isDraggable: true,
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
				columnType: ColumnType.Volume24h,
				isDraggable: false,
				isShow: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.Volume24hNorm,
				isDraggable: false,
				isShow: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.Launched,
				isDraggable: false,
				isShow: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.Incentive,
				isDraggable: false,
				isShow: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.DEXRank,
				isDraggable: false,
				isShow: true,
				groupOrder: 0,
			},
			{
				columnType: ColumnType.TrustScore,
				isDraggable: false,
				isShow: true,
				groupOrder: 1,
			},
		],
	);
