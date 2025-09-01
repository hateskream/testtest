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
			groupOrder: 1,
			isShow: true,
			isDraggable: true,
		},
		{
			columnType: ColumnType.PriceMin24h,
			groupOrder: 1,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.PriceMax24h,
			groupOrder: 1,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.PriceMin1y,
			groupOrder: 1,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.PriceMax1y,
			groupOrder: 1,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.PriceAvg50d,
			groupOrder: 1,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.PriceAvg200d,
			groupOrder: 1,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.PriceOpen,
			groupOrder: 3,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.PriceClose,
			groupOrder: 4,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.Price1yRange,
			groupOrder: 1,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.Price24hChart,
			groupOrder: 2,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.Price7dChart,
			groupOrder: 2,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.Price30dChart,
			groupOrder: 2,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.ChangePrice24h,
			groupOrder: 5,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.ChangePrice1hPercent,
			groupOrder: 5,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.ChangePrice24hPercent,
			groupOrder: 5,
			isShow: true,
			isDraggable: true,
		},
		{
			columnType: ColumnType.ChangePrice7dPercent,
			groupOrder: 5,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.ChangePrice30dPercent,
			groupOrder: 5,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.Volume24h,
			groupOrder: 6,
			isShow: true,
			isDraggable: true,
		},
		{
			columnType: ColumnType.VolumeRel10d,
			groupOrder: 7,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.VolumeAvg10d,
			groupOrder: 6,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.VolumeAvg50d,
			groupOrder: 6,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.MarketCap24h,
			groupOrder: 9,
			isShow: true,
			isDraggable: true,
		},
		{
			columnType: ColumnType.MarketCapRank,
			groupOrder: 9,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.MarketCapFullyDiluted,
			groupOrder: 9,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.MarketCapChange24h,
			groupOrder: 9,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.MarketCapChange24hPercent,
			groupOrder: 9,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.CirculatingSupply,
			groupOrder: 10,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.TotalSupply,
			groupOrder: 10,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.MaxSupply,
			groupOrder: 10,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.AllTimeHigh,
			groupOrder: 11,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.AllTimeHighChangePercent,
			groupOrder: 11,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.AllTimeHighDate,
			groupOrder: 11,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.AllTimeLow,
			groupOrder: 12,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.AllTimeLowChangePercent,
			groupOrder: 12,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.AllTimeLowDate,
			groupOrder: 12,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.RSIValue,
			groupOrder: 17,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.RSIChart,
			groupOrder: 17,
			isShow: false,
			isDraggable: true,
		},

		// Beta - group 13
		{
			columnType: ColumnType.Beta5y,
			groupOrder: 13,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.LastDividend,
			groupOrder: 14,
			isShow: false,
			isDraggable: true,
		},

		// Company info columns - group 15
		{
			columnType: ColumnType.Employees,
			groupOrder: 15,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.IpODate,
			groupOrder: 15,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.Sector,
			groupOrder: 15,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.Industry,
			groupOrder: 15,
			isShow: false,
			isDraggable: true,
		},

		// Source - group 16
		{
			columnType: ColumnType.Source,
			groupOrder: 16,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.ListingDate,
			groupOrder: 17,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.UpdateDate,
			groupOrder: 8,
			isShow: false,
			isDraggable: true,
		},
		{
			columnType: ColumnType.Volatility,
			groupOrder: 17,
			isShow: false,
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

