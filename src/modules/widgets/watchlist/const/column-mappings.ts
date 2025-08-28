import type { IWatchlistRow } from '../model';
import { CellType, ColumnType } from './cell-types';

// Column type to cell type mapping
export const COLUMN_TYPE_TO_CELL_TYPE: Record<string, CellType> = {
	// Symbol types
	[ColumnType.SYMBOL]: CellType.SYMBOL,

	// Number types
	[ColumnType.PRICE_CURRENT]: CellType.NUMBER,
	[ColumnType.VOLUME_24H]: CellType.NUMBER,
	[ColumnType.MARKET_CAP24H]: CellType.NUMBER,
	[ColumnType.VOLUME_AVG10D]: CellType.NUMBER,
	[ColumnType.RSI_NUMBER]: CellType.NUMBER,
	[ColumnType.BETA5Y]: CellType.NUMBER,
	[ColumnType.OPEN_PRICE]: CellType.NUMBER,
	[ColumnType.CLOSE_PRICE]: CellType.NUMBER,
	[ColumnType.CHANGE_PRICE_24H]: CellType.NUMBER,
	[ColumnType.PRICE_MIN24H]: CellType.NUMBER,
	[ColumnType.PRICE_MAX24H]: CellType.NUMBER,
	[ColumnType.PRICE_MIN1Y]: CellType.NUMBER,
	[ColumnType.PRICE_MAX1Y]: CellType.NUMBER,
	[ColumnType.PRICE_AVG50D]: CellType.NUMBER,
	[ColumnType.PRICE_AVG200D]: CellType.NUMBER,
	[ColumnType.VOLUME_REL10D]: CellType.NUMBER,

	// Percent types
	[ColumnType.CHANGE_PRICE_1H_PERCENT]: CellType.PERCENT,
	[ColumnType.CHANGE_PRICE_24H_PERCENT]: CellType.PERCENT,
	[ColumnType.CHANGE_PRICE_7D_PERCENT]: CellType.PERCENT,
	[ColumnType.CHANGE_PRICE_30D_PERCENT]: CellType.PERCENT,

	// Chart types
	[ColumnType.PRICE_24H_CHART]: CellType.CHART,
	[ColumnType.PRICE_7D_CHART]: CellType.CHART,
	[ColumnType.PRICE_30D_CHART]: CellType.CHART,
	[ColumnType.RSI_CHART]: CellType.CHART,

	// Range types
	[ColumnType.PRICE_1Y_RANGE]: CellType.RANGE,

	// Text types
	[ColumnType.LAST_DIVIDEND]: CellType.TEXT,
	[ColumnType.COMPANY_EMPLOYEES]: CellType.TEXT,
	[ColumnType.COMPANY_IPO_DATE]: CellType.TEXT,
	[ColumnType.COMPANY_SECTOR]: CellType.TEXT,
	[ColumnType.COMPANY_INDUSTRY]: CellType.TEXT,
	[ColumnType.SOURCE]: CellType.TEXT,
	[ColumnType.LISTING_DATE]: CellType.TEXT,
	[ColumnType.UPDATE_DATE]: CellType.TEXT,
};

// Column type to row property mapping - используем columnType из store
export const COLUMN_TYPE_TO_ROW_PROPERTY: Record<string, keyof IWatchlistRow> = {
	symbol: 'symbol',
	price: 'priceCurrent',
	chg24h: 'changePrice24hPercent',
	chg1h: 'changePrice1hPercent',
	chg7d: 'changePrice7dPercent',
	chg30d: 'changePrice30dPercent',
	volume24h: 'volume24h',
	marketCap24h: 'marketCap24h',
	volume: 'volumeAvg10d',
	marketCap: 'marketCap24h',
	changePrice24h: 'changePrice24h',
	priceMin24h: 'priceMin24h',
	priceMax24h: 'priceMax24h',
	priceMin1y: 'priceMin1y',
	priceMax1y: 'priceMax1y',
	priceAvg50d: 'priceAvg50d',
	priceAvg200d: 'priceAvg200d',
	volumeRel10d: 'volumeRel10d',
	volumeAvg10d: 'volumeAvg10d',
	rsi: 'rsiNumber',
	beta: 'beta5y',
	openPrice: 'openPrice',
	closePrice: 'closePrice',
	range1y: 'price1yRange',
	chart24h: 'price24hChart',
	chart7d: 'price7dChart',
	chart30d: 'price30dChart',
	rsiChart: 'rsiChart',
	lastDividend: 'lastDividend',
	employees: 'companyEmployees',
	ipoDate: 'companyIpoDate',
	sector: 'companySector',
	industry: 'companyIndustry',
	source: 'source',
	listingDate: 'listingDate',
	updateDate: 'updateDate',
};

// Backward compatibility - Column ID to row property mapping
export const COLUMN_ID_TO_ROW_PROPERTY: Record<string, keyof IWatchlistRow> = {
	symbol: 'symbol',
	priceCurrent: 'priceCurrent',
	changePrice24hPercent: 'changePrice24hPercent',
	volume24h: 'volume24h',
	marketCap24h: 'marketCap24h',
	changePrice1hPercent: 'changePrice1hPercent',
	changePrice7dPercent: 'changePrice7dPercent',
	changePrice30dPercent: 'changePrice30dPercent',
	changePrice24h: 'changePrice24h',
	priceMin24h: 'priceMin24h',
	priceMax24h: 'priceMax24h',
	priceMin1y: 'priceMin1y',
	priceMax1y: 'priceMax1y',
	priceAvg50d: 'priceAvg50d',
	priceAvg200d: 'priceAvg200d',
	volumeRel10d: 'volumeRel10d',
	volumeAvg10d: 'volumeAvg10d',
	rsiNumber: 'rsiNumber',
	beta5y: 'beta5y',
	openPrice: 'openPrice',
	closePrice: 'closePrice',
	price1yRange: 'price1yRange',
	price24hChart: 'price24hChart',
	price7dChart: 'price7dChart',
	price30dChart: 'price30dChart',
	rsiChart: 'rsiChart',
	lastDividend: 'lastDividend',
	companyEmployees: 'companyEmployees',
	companyIpoDate: 'companyIpoDate',
	companySector: 'companySector',
	companyIndustry: 'companyIndustry',
	source: 'source',
	listingDate: 'listingDate',
	updateDate: 'updateDate',
};

// Helper functions
export const getCellType = (columnType: string): CellType => {
	return COLUMN_TYPE_TO_CELL_TYPE[columnType] || CellType.TEXT;
};

export const getCellData = (row: IWatchlistRow, column: { id?: string; columnType?: string }) => {
	// Сначала пробуем найти по columnType (приоритет), затем по id
	const columnKey = column.columnType || column.id;
	let propertyName: keyof IWatchlistRow | undefined;

	if (columnKey) {
		propertyName = COLUMN_TYPE_TO_ROW_PROPERTY[columnKey];

		// Fallback на старый маппинг по id
		if (!propertyName && column.id) {
			propertyName = COLUMN_ID_TO_ROW_PROPERTY[column.id];
		}
	}

	if (!propertyName) {
		return { value: '—' };
	}

	const data = row[propertyName];
	if (!data) {
		return { value: '—' };
	}
	return data;
};

// Type alias for column parameter
type ColumnParam = { id?: string; columnType?: string };

// Type-safe getters for specific cell types with fallbacks
export const getSymbolCellData = (
	row: IWatchlistRow,
	column: ColumnParam,
): import('../model').IWatchlistSymbolCell => {
	const data = getCellData(row, column);
	if (data && typeof data === 'object' && 'symbolType' in data) {
		return data as import('../model').IWatchlistSymbolCell;
	}
	return { symbolType: 'Stock', ticker: '', srcImg: '' };
};

export const getNumberCellData = (
	row: IWatchlistRow,
	column: ColumnParam,
): import('../model').IWatchlistNumberCell => {
	const data = getCellData(row, column);
	if (data && typeof data === 'object' && 'value' in data) {
		return data as import('../model').IWatchlistNumberCell;
	}
	return { value: '0', currencySymbol: '', trend: 'neutral' };
};

export const getPercentCellData = (
	row: IWatchlistRow,
	column: ColumnParam,
): import('../model').IWatchlistPercentCell => {
	const data = getCellData(row, column);
	if (data && typeof data === 'object' && 'value' in data && 'trend' in data) {
		return data as import('../model').IWatchlistPercentCell;
	}
	return { value: '0', trend: 'neutral' };
};

export const getChartCellData = (
	row: IWatchlistRow,
	column: ColumnParam,
): import('../model').IWatchlistSvgChartCell => {
	const data = getCellData(row, column);
	if (data && typeof data === 'object' && 'src' in data) {
		return data as import('../model').IWatchlistSvgChartCell;
	}
	return { src: '' };
};

export const getRangeCellData = (
	row: IWatchlistRow,
	column: ColumnParam,
): import('../model').IWatchlistRangeCell => {
	const data = getCellData(row, column);
	if (data && typeof data === 'object' && 'startValue' in data && 'endValue' in data) {
		return data as import('../model').IWatchlistRangeCell;
	}
	return { startValue: '0', endValue: '0', currencySymbol: '' };
};

export const getTextCellData = (
	row: IWatchlistRow,
	column: ColumnParam,
): import('../model').IWatchlistTextCell => {
	const data = getCellData(row, column);
	if (data && typeof data === 'object' && 'value' in data) {
		return data as import('../model').IWatchlistTextCell;
	}
	return { value: '—' };
};
