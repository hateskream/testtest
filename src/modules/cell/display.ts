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
	name: string;
	shortName: string;
}

export const columnDisplay: Record<ColumnType, IColumnDisplay> = {
	[ColumnType.Symbol]: {
		name: 'Symbol',
		shortName: 'Symbol',
	},
	[ColumnType.PriceCurrent]: {
		name: 'Current price',
		shortName: 'Price',
	},
	[ColumnType.PriceMin24h]: {
		name: 'Low price, 24 hours',
		shortName: 'Low, 24h',
	},
	[ColumnType.PriceMax24h]: {
		name: 'High price, 24 hours',
		shortName: 'High, 24h',
	},
	[ColumnType.PriceMin1y]: {
		name: 'Low price, 1 year',
		shortName: 'Low, 1y',
	},
	[ColumnType.PriceMax1y]: {
		name: 'High price, 1year',
		shortName: 'High, 1y',
	},
	[ColumnType.PriceAvg50d]: {
		name: 'Average price, 50 days',
		shortName: ' Avg, 50d',
	},
	[ColumnType.PriceAvg200d]: {
		name: 'Average price, 200 days',
		shortName: 'Avg, 200d',
	},
	[ColumnType.Price1yRange]: { // Range, 1y
		name: '1y Price Range', // Price range
		shortName: '1y Range', // Range
	},
	[ColumnType.Price24hChart]: {
		name: 'Price chart, 24 hours',
		shortName: 'Price, 24h',
	},
	[ColumnType.Price7dChart]: {
		name: 'Price chart, 7 days',
		shortName: 'Price, 7d',
	},
	[ColumnType.Price30dChart]: {
		name: 'Price chart, 30 days',
		shortName: 'Price, 30d',
	},
	[ColumnType.ChangePrice24h]: {
		name: 'Price change, 24 hours',
		shortName: 'Chg, 24h',
	},
	[ColumnType.ChangePrice1hPercent]: {
		name: 'Price change, 1 hour',
		shortName: 'Chg, 1h',
	},
	[ColumnType.ChangePrice24hPercent]: {
		name: 'Price change %, 24 hours',
		shortName: 'Chg%, 24h',
	},
	[ColumnType.ChangePrice7dPercent]: {
		name: 'Price change, 7 days',
		shortName: 'Chg%, 7d',
	},
	[ColumnType.ChangePrice30dPercent]: {
		name: 'Price change, 30 days',
		shortName: 'Chg%, 30d',
	},
	[ColumnType.Volume24h]: {
		name: 'Volume, 24 hours',
		shortName: 'Volume, 24h',
	},
	// FIXME: Кто такой этот relative volume? Из какого маркета? Я не нашел в макете
	[ColumnType.VolumeRel10d]: {
		name: 'Relative volume, 10 days',
		shortName: 'Rel vol, 10d',
	},
	[ColumnType.VolumeAvg10d]: {
		name: 'Average daily volume, 10 days',
		shortName: 'Avg volume, 10d',
	},
	[ColumnType.VolumeAvg50d]: {
		name: 'Average daily volume, 50 days',
		shortName: 'Avg volume, 50d',
	},
	[ColumnType.MarketCap24h]: {
		name: 'Market capitalization',
		shortName: 'Market cap',
	},
	[ColumnType.MarketCapRank]: {
		name: 'Market capitalization rank',
		shortName: 'Mcap rank',
	},
	[ColumnType.MarketCapFullyDiluted]: {
		name: 'Fully diluted market cap',
		shortName: 'FD market cap',
	},
	[ColumnType.MarketCapChange24h]: {
		name: 'Market cap change, 24 hours',
		shortName: 'Mcap chg, 24h',
	},
	[ColumnType.MarketCapChange24hPercent]: {
		name: 'Market cap change %, 24 hours',
		shortName: 'Mcap chg%, 24h',
	},
	[ColumnType.CirculatingSupply]: {
		name: 'Circulating supply',
		shortName: 'Circ supply',
	},
	[ColumnType.TotalSupply]: {
		name: 'Total supply',
		shortName: 'Total supply',
	},
	[ColumnType.MaxSupply]: {
		name: 'Max supply',
		shortName: 'Max supply',
	},
	[ColumnType.AllTimeHigh]: {
		name: 'All time high',
		shortName: 'ATH',
	},
	[ColumnType.AllTimeHighChangePercent]: {
		name: 'All time high change %',
		shortName: 'ATH Chg%',
	},
	[ColumnType.AllTimeHighDate]: {
		name: 'All time high date',
		shortName: 'ATH Date',
	},
	[ColumnType.AllTimeLow]: {
		name: 'All Time Low',
		shortName: 'ATL',
	},
	[ColumnType.AllTimeLowChangePercent]: {
		name: 'All time low change %',
		shortName: 'ATL Chg%',
	},
	[ColumnType.AllTimeLowDate]: {
		name: 'All time low date',
		shortName: 'ATL date',
	},
	// FIXME: А эти два столбца откуда родились? Не могу найти в макете
	[ColumnType.RSIValue]: {
		name: 'RSI Value',
		shortName: 'RSI',
	},
	[ColumnType.RSIChart]: {
		name: 'RSI Chart',
		shortName: 'RSI Chart',
	},
	[ColumnType.Beta5y]: {
		name: 'Beta, 5 years',
		shortName: 'Beta, 5y',
	},
	[ColumnType.LastDividend]: {
		name: 'Last dividend per share',
		shortName: 'Last dividend',
	},
	[ColumnType.Employees]: {
		name: 'Number of employees',
		shortName: 'Empoyees',
	},
	[ColumnType.IpODate]: {
		name: 'Initial public offering date',
		shortName: 'IPO date',
	},
	[ColumnType.Sector]: {
		name: 'Sector',
		shortName: 'Sector',
	},
	[ColumnType.Industry]: {
		name: 'Industry',
		shortName: 'Industry',
	},
	[ColumnType.Source]: {
		name: 'Source',
		shortName: 'Source',
	},
	[ColumnType.ListingDate]: {
		name: 'Listing Date',
		shortName: 'List',
	},
	[ColumnType.UpdateDate]: {
		name: 'Data updated',
		shortName: 'Updated',
	},
	[ColumnType.PriceOpen]: {
		name: 'Open',
		shortName: 'Open',
	},
	[ColumnType.PriceClose]: {
		name: 'Previous close',
		shortName: 'Close',
	},
};
