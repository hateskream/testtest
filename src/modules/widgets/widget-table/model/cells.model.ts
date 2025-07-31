// Cell types for Table table - mapped from backend table_mapper/dto.go

export interface ITableSymbolCell {
	symbolType: string; // Required: indicates the type of symbol "Index", "Commodity", "Stock", "Crypto", "Forex"
	srcImg?: string; // Optional: used by Index, Commodity, Stock, Crypto
	ticker?: string; // Optional: used by Index, Commodity, Stock, Crypto
	indexName?: string; // Optional: used by Index
	commodityName?: string; // Optional: used by Commodity
	companyName?: string; // Optional: used by Stock
	blockchain?: string; // Optional: used by Crypto
	rightSrcImg?: string; // Optional: used by Forex
	leftSrcImg?: string; // Optional: used by Forex
	rightTicker?: string; // Optional: used by Forex
	leftTicker?: string; // Optional: used by Forex
}

export interface ITableNumberCell {
	value?: string;
	trend?: string;
	currencySymbol?: string;
	magnitude?: string;
}

export interface ITablePercentCell {
	value?: string;
	trend?: string;
}

export interface ITableSvgChartCell {
	src?: string;
}

export interface ITableTextCell {
	value?: string;
}

export interface ITableRangeCell {
	currencySymbol?: string;
	startValue?: string;
	endValue?: string;
	startMagnitude?: string;
	endMagnitude?: string;
}
