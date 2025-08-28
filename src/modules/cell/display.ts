import { isForexSymbolCell, isCryptoSymbolCell, isStockSymbolCell, isIndexSymbolCell } from './check';
import { Magnitude, type INumberCell, type IPercentCell, Trend, type ISymbolCell, ColumnType } from './domain';

export function getMagnitudeText(magnitude: Magnitude): string {
	switch (magnitude) {
		case Magnitude.THOUSAND:
			return 'K';
		case Magnitude.MILLION:
			return 'M';
		case Magnitude.BILLION:
			return 'B';
		case Magnitude.TRILLION:
			return 'T';
		case Magnitude.NONE:
		default:
			return '';
	}
}

export function getNumberText(cell: INumberCell): string {
	return `${cell.currencySymbol} ${cell.value} ${getMagnitudeText(cell.magnitude)}`;
}

export interface IPercentData {
	color: string;
	value: string;
}

const trendToColor: Record<Trend, string> = {
	[Trend.UP]: 'rgba(4, 237, 160, 1)',
	[Trend.DOWN]: 'rgba(252, 74, 107, 1)',
	[Trend.NEUTRAL]: 'rgba(250, 250, 250, 1)',
};

export function getPercentData(cell: IPercentCell): IPercentData {
	return {
		color: trendToColor[cell.trend],
		value: `${cell.value}%`,
	};
}

export function getTickerName(symbolCell: ISymbolCell) {
	if (isForexSymbolCell(symbolCell)) {
		return `${symbolCell.leftTicker}/${symbolCell.rightTicker}`;
	}

	if (isCryptoSymbolCell(symbolCell)) {
		return symbolCell.ticker;
	}

	if (isStockSymbolCell(symbolCell)) {
		return symbolCell.ticker;
	}

	if (isIndexSymbolCell(symbolCell)) {
		return symbolCell.ticker;
	}

	return '';
}

export function getTickerDescription(symbolCell: ISymbolCell) {
	if (isForexSymbolCell(symbolCell)) {
		return `${symbolCell.leftTicker}/${symbolCell.rightTicker}`;
	}

	if (isCryptoSymbolCell(symbolCell)) {
		return symbolCell.blockchain;
	}

	if (isStockSymbolCell(symbolCell)) {
		return symbolCell.companyName;
	}

	if (isIndexSymbolCell(symbolCell)) {
		return symbolCell.indexName;
	}


	return '';
}

interface IColumnDisplay {
	columnName: string;
	tooltip: string;
	settingsName: string;
}

export const columnDisplay: Record<ColumnType, IColumnDisplay> = {
	[ColumnType.Symbol]: {
		columnName: 'Symbol',
		tooltip: 'Symbol',
		settingsName: 'Symbol',
	},
	[ColumnType.PriceCurrent]: {
		columnName: 'Price',
		tooltip: 'Current price',
		settingsName: 'Current',
	},
	[ColumnType.PriceMin24h]: {
		columnName: 'Low, 24h',
		tooltip: 'Low price, 24 hours',
		settingsName: 'Low, 24h',
	},
	[ColumnType.PriceMax24h]: {
		columnName: 'High, 24h',
		tooltip: 'High price, 24 hours',
		settingsName: 'High, 24h',
	},
	[ColumnType.PriceMin1y]: {
		columnName: 'Low, 1y',
		tooltip: 'Low price, 1 year',
		settingsName: 'Low, Year',
	},
	[ColumnType.PriceMax1y]: {
		columnName: 'High, 1y',
		tooltip: 'High price, 1 year',
		settingsName: 'High, Year',
	},
	[ColumnType.PriceAvg50d]: {
		columnName: 'Avg, 50d',
		tooltip: 'Average price, 50 days',
		settingsName: 'Average, 50d',
	},
	[ColumnType.PriceAvg200d]: {
		columnName: 'Avg, 200d',
		tooltip: 'Average price, 200 days',
		settingsName: 'Average, 200d',
	},
	[ColumnType.Price1yRange]: {
		columnName: 'Range',
		tooltip: 'Price range',
		settingsName: 'Range, 1y',
	},
	[ColumnType.Price24hChart]: {
		columnName: 'Price, 24h',
		tooltip: 'Price chart, 24 hours',
		settingsName: '24h',
	},
	[ColumnType.Price7dChart]: {
		columnName: 'Price, 7d',
		tooltip: 'Price chart, 7 days',
		settingsName: '7d',
	},
	[ColumnType.Price30dChart]: {
		columnName: 'Price, 30d',
		tooltip: 'Price chart, 30 days',
		settingsName: '30d',
	},
	[ColumnType.ChangePrice24h]: {
		columnName: 'Chg, 24h',
		tooltip: 'Price change, 24 hours',
		settingsName: '24h',
	},
	[ColumnType.ChangePrice1hPercent]: {
		columnName: 'Chg, 1h',
		tooltip: 'Price change, 1 hour',
		settingsName: '1h, %',
	},
	[ColumnType.ChangePrice24hPercent]: {
		columnName: 'Chg%, 24h',
		tooltip: 'Price change %, 24 hours',
		settingsName: '24h, %',
	},
	[ColumnType.ChangePrice7dPercent]: {
		columnName: 'Chg%, 7d',
		tooltip: 'Price change, 7 days',
		settingsName: '7d, %',
	},
	[ColumnType.ChangePrice30dPercent]: {
		columnName: 'Chg%, 30d',
		tooltip: 'Price change, 30 days',
		settingsName: '30d, %',
	},
	[ColumnType.Volume24h]: {
		columnName: 'Volume, 24h',
		tooltip: 'Volume, 24 hours',
		settingsName: '24h',
	},
	// FIXME: Кто такой этот relative volume? Из какого маркета? Я не нашел в макете
	[ColumnType.VolumeRel10d]: {
		columnName: 'Rel vol, 10d',
		tooltip: 'Relative volume, 10 days',
		settingsName: 'Rel vol, 10d',
	},
	[ColumnType.VolumeAvg10d]: {
		columnName: 'Avg volume, 10d',
		tooltip: 'Average daily volume, 10 days',
		settingsName: 'Average, 10d',
	},
	[ColumnType.VolumeAvg50d]: {
		columnName: 'Avg volume, 50d',
		tooltip: 'Average daily volume, 50 days',
		settingsName: 'Average, 50d',
	},
	[ColumnType.MarketCap24h]: {
		columnName: 'Market cap',
		tooltip: 'Market capitalization',
		settingsName: 'Market cap',
	},
	[ColumnType.MarketCapRank]: {
		columnName: 'Mcap rank',
		tooltip: 'Market capitalization rank',
		settingsName: 'Rank',
	},
	[ColumnType.MarketCapFullyDiluted]: {
		columnName: 'FD market cap',
		tooltip: 'Fully diluted market cap',
		settingsName: 'Fully diluted valuation',
	},
	[ColumnType.MarketCapChange24h]: {
		columnName: 'Mcap chg, 24h',
		tooltip: 'Market cap change, 24 hours',
		settingsName: 'Change, 24h',
	},
	[ColumnType.MarketCapChange24hPercent]: {
		columnName: 'Mcap chg%, 24h',
		tooltip: 'Market cap change %, 24 hours',
		settingsName: 'Change 24h, %',
	},
	[ColumnType.CirculatingSupply]: {
		columnName: 'Circ supply',
		tooltip: 'Circulating supply',
		settingsName: 'Circulating',
	},
	[ColumnType.TotalSupply]: {
		columnName: 'Total supply',
		tooltip: 'Total supply',
		settingsName: 'Total',
	},
	[ColumnType.MaxSupply]: {
		columnName: 'Max supply',
		tooltip: 'Max supply',
		settingsName: 'Max',
	},
	[ColumnType.AllTimeHigh]: {
		columnName: 'ATH',
		tooltip: 'All time high',
		settingsName: 'All time high',
	},
	[ColumnType.AllTimeHighChangePercent]: {
		columnName: 'ATH Chg%',
		tooltip: 'All time high change %',
		settingsName: 'Change, %',
	},
	[ColumnType.AllTimeHighDate]: {
		columnName: 'ATH Date',
		tooltip: 'All time high date',
		settingsName: 'Date',
	},
	[ColumnType.AllTimeLow]: {
		columnName: 'ATL',
		tooltip: 'All time low',
		settingsName: 'All time low',
	},
	[ColumnType.AllTimeLowChangePercent]: {
		columnName: 'ATL Chg%',
		tooltip: 'All time low change %',
		settingsName: 'Change, %',
	},
	[ColumnType.AllTimeLowDate]: {
		columnName: 'ATL date',
		tooltip: 'All time low date',
		settingsName: 'Date',
	},
	// FIXME: А эти два столбца откуда родились? Не могу найти в макете
	[ColumnType.RSIValue]: {
		columnName: 'RSI Value',
		tooltip: 'RSI Value',
		settingsName: 'RSI',
	},
	[ColumnType.RSIChart]: {
		columnName: 'RSI Chart',
		tooltip: 'RSI Chart',
		settingsName: 'RSI Chart',
	},
	[ColumnType.Beta5y]: {
		columnName: 'Beta, 5y',
		tooltip: 'Beta, 5 years',
		settingsName: 'Beta, 5y',
	},
	[ColumnType.LastDividend]: {
		columnName: 'Last dividend',
		tooltip: 'Last dividend per share',
		settingsName: 'Last dividend',
	},
	[ColumnType.Employees]: {
		columnName: 'Employees',
		tooltip: 'Number of employees',
		settingsName: 'Employees',
	},
	[ColumnType.IpODate]: {
		columnName: 'IPO date',
		tooltip: 'Initial public offering date',
		settingsName: 'IPO date',
	},
	[ColumnType.Sector]: {
		columnName: 'Sector',
		tooltip: 'Sector',
		settingsName: 'Sector',
	},
	[ColumnType.Industry]: {
		columnName: 'Industry',
		tooltip: 'Industry',
		settingsName: 'Industry',
	},
	[ColumnType.Source]: {
		columnName: 'Source',
		tooltip: 'Source',
		settingsName: 'Source',
	},
	// FIXME: Поидее должно быть в крипто, но в макете нет
	[ColumnType.ListingDate]: {
		columnName: 'Listing Date',
		tooltip: 'Listing date',
		settingsName: 'List',
	},
	[ColumnType.UpdateDate]: {
		columnName: 'Data updated',
		tooltip: 'Data updated',
		settingsName: 'Updated',
	},
	[ColumnType.PriceOpen]: {
		columnName: 'Open',
		tooltip: 'Open',
		settingsName: 'Day',
	},
	[ColumnType.PriceClose]: {
		columnName: 'Close',
		tooltip: 'Previous close',
		settingsName: 'Previous day',
	},
	[ColumnType.Volatility]: {
		columnName: 'Volatility',
		tooltip: 'Volatility',
		settingsName: 'Volatility',
	},
};
