import { buildColumns, ColumnType, type ITableColumn } from '@/modules/cell';

export const ALL_COLUMNS: ITableColumn[] = buildColumns(
	[
		{
			columnType: ColumnType.Symbol,
			isDraggable: false,
			isShow: true,
			groupOrder: 0,
		},
		{
			columnType: ColumnType.PriceCurrent,
			groupOrder: 0,
			isShow: true,
			isDraggable: true,
		},
	],
);

// старые колонки
// export const COLUMN_TYPE_TO_CELL_TYPE: Record<string, CellType> = {
// 	// Symbol types
// 	[ColumnType.SYMBOL]: CellType.SYMBOL,

// 	// Number types
// 	[ColumnType.PRICE_CURRENT]: CellType.NUMBER,
// 	[ColumnType.VOLUME_24H]: CellType.NUMBER,
// 	[ColumnType.MARKET_CAP24H]: CellType.NUMBER,
// 	[ColumnType.VOLUME_AVG10D]: CellType.NUMBER,
// 	[ColumnType.RSI_NUMBER]: CellType.NUMBER,
// 	[ColumnType.BETA5Y]: CellType.NUMBER,
// 	[ColumnType.OPEN_PRICE]: CellType.NUMBER,
// 	[ColumnType.CLOSE_PRICE]: CellType.NUMBER,
// 	[ColumnType.CHANGE_PRICE_24H]: CellType.NUMBER,
// 	[ColumnType.PRICE_MIN24H]: CellType.NUMBER,
// 	[ColumnType.PRICE_MAX24H]: CellType.NUMBER,
// 	[ColumnType.PRICE_MIN1Y]: CellType.NUMBER,
// 	[ColumnType.PRICE_MAX1Y]: CellType.NUMBER,
// 	[ColumnType.PRICE_AVG50D]: CellType.NUMBER,
// 	[ColumnType.PRICE_AVG200D]: CellType.NUMBER,
// 	[ColumnType.VOLUME_REL10D]: CellType.NUMBER,

// 	// Percent types
// 	[ColumnType.CHANGE_PRICE_1H_PERCENT]: CellType.PERCENT,
// 	[ColumnType.CHANGE_PRICE_24H_PERCENT]: CellType.PERCENT,
// 	[ColumnType.CHANGE_PRICE_7D_PERCENT]: CellType.PERCENT,
// 	[ColumnType.CHANGE_PRICE_30D_PERCENT]: CellType.PERCENT,

// 	// Chart types
// 	[ColumnType.PRICE_24H_CHART]: CellType.CHART,
// 	[ColumnType.PRICE_7D_CHART]: CellType.CHART,
// 	[ColumnType.PRICE_30D_CHART]: CellType.CHART,
// 	[ColumnType.RSI_CHART]: CellType.CHART,

// 	// Range types
// 	[ColumnType.PRICE_1Y_RANGE]: CellType.RANGE,

// 	// Text types
// 	[ColumnType.LAST_DIVIDEND]: CellType.TEXT,
// 	[ColumnType.COMPANY_EMPLOYEES]: CellType.TEXT,
// 	[ColumnType.COMPANY_IPO_DATE]: CellType.TEXT,
// 	[ColumnType.COMPANY_SECTOR]: CellType.TEXT,
// 	[ColumnType.COMPANY_INDUSTRY]: CellType.TEXT,
// 	[ColumnType.SOURCE]: CellType.TEXT,
// 	[ColumnType.LISTING_DATE]: CellType.TEXT,
// 	[ColumnType.UPDATE_DATE]: CellType.TEXT,
// };

