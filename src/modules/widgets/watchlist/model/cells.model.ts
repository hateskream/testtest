// Cell types for watchlist table - mapped from backend table_mapper/dto.go

export interface IWatchlistSymbolCell {
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

export interface IWatchlistNumberCell {
	value?: string;
	trend?: string;
	currencySymbol?: string;
	magnitude?: string;
}

export interface IWatchlistPercentCell {
	value?: string;
	trend?: string;
}

export interface IWatchlistSvgChartCell {
	src?: string;
}

export interface IWatchlistTextCell {
	value?: string;
}

export interface IWatchlistRangeCell {
	currencySymbol?: string;
	startValue?: string;
	endValue?: string;
	startMagnitude?: string;
	endMagnitude?: string;
}

// Row model with all cell types - mapped from backend mappers/row.go
export interface IWatchlistRow {
	tickerID: string;
	symbol: IWatchlistSymbolCell;

	// Number cells - prices
	priceCurrent: IWatchlistNumberCell;
	priceMin24h: IWatchlistNumberCell;
	priceMax24h: IWatchlistNumberCell;
	priceMin1y: IWatchlistNumberCell;
	priceMax1y: IWatchlistNumberCell;
	priceAvg50d: IWatchlistNumberCell;
	priceAvg200d: IWatchlistNumberCell;
	changePrice24h: IWatchlistNumberCell;
	volume24h: IWatchlistNumberCell;
	volumeRel10d: IWatchlistNumberCell;
	volumeAvg10d: IWatchlistNumberCell;
	marketCap24h: IWatchlistNumberCell;
	rsiNumber: IWatchlistNumberCell;
	beta5y: IWatchlistNumberCell;
	openPrice: IWatchlistNumberCell;
	closePrice: IWatchlistNumberCell;

	// Percent cells
	changePrice1hPercent: IWatchlistPercentCell;
	changePrice24hPercent: IWatchlistPercentCell;
	changePrice7dPercent: IWatchlistPercentCell;
	changePrice30dPercent: IWatchlistPercentCell;

	// Range cells
	price1yRange: IWatchlistRangeCell;

	// Chart cells
	price24hChart: IWatchlistSvgChartCell;
	price7dChart: IWatchlistSvgChartCell;
	price30dChart: IWatchlistSvgChartCell;
	rsiChart: IWatchlistSvgChartCell;

	// Text cells
	lastDividend: IWatchlistTextCell;
	companyEmployees: IWatchlistTextCell;
	companyIpoDate: IWatchlistTextCell;
	companySector: IWatchlistTextCell;
	companyIndustry: IWatchlistTextCell;
	source: IWatchlistTextCell;
	listingDate: IWatchlistTextCell;
	updateDate: IWatchlistTextCell;
}
