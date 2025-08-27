export interface IRow {
	id: string;
}

export function createRow(tickerId: string): IRow {
	return {
		id: tickerId,
	};
}

// export interface IWatchlistRow {
// 	tickerID: string;
// 	symbol: IWatchlistSymbolCell;

// 	// Number cells - prices
// 	priceCurrent: IWatchlistNumberCell;
// 	priceMin24h: IWatchlistNumberCell;
// 	priceMax24h: IWatchlistNumberCell;
// 	priceMin1y: IWatchlistNumberCell;
// 	priceMax1y: IWatchlistNumberCell;
// 	priceAvg50d: IWatchlistNumberCell;
// 	priceAvg200d: IWatchlistNumberCell;
// 	changePrice24h: IWatchlistNumberCell;
// 	volume24h: IWatchlistNumberCell;
// 	volumeRel10d: IWatchlistNumberCell;
// 	volumeAvg10d: IWatchlistNumberCell;
// 	marketCap24h: IWatchlistNumberCell;
// 	rsiNumber: IWatchlistNumberCell;
// 	beta5y: IWatchlistNumberCell;
// 	openPrice: IWatchlistNumberCell;
// 	closePrice: IWatchlistNumberCell;

// 	// Percent cells
// 	changePrice1hPercent: IWatchlistPercentCell;
// 	changePrice24hPercent: IWatchlistPercentCell;
// 	changePrice7dPercent: IWatchlistPercentCell;
// 	changePrice30dPercent: IWatchlistPercentCell;

// 	// Range cells
// 	price1yRange: IWatchlistRangeCell;

// 	// Chart cells
// 	price24hChart: IWatchlistSvgChartCell;
// 	price7dChart: IWatchlistSvgChartCell;
// 	price30dChart: IWatchlistSvgChartCell;
// 	rsiChart: IWatchlistSvgChartCell;

// 	// Text cells
// 	lastDividend: IWatchlistTextCell;
// 	companyEmployees: IWatchlistTextCell;
// 	companyIpoDate: IWatchlistTextCell;
// 	companySector: IWatchlistTextCell;
// 	companyIndustry: IWatchlistTextCell;
// 	source: IWatchlistTextCell;
// 	listingDate: IWatchlistTextCell;
// 	updateDate: IWatchlistTextCell;
// }
