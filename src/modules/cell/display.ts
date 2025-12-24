import {
	isCommoditySymbolCell,
	isCryptoSymbolCell,
	isForexSymbolCell,
	isIndexSymbolCell,
	isStockSymbolCell,
} from './check';
import { ColumnType, type INumberCell, type IPercentCell, type ISymbolCell, Magnitude, Trend } from './domain';

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
	[Trend.UP]: 'var(--color-metrics-positive, #04EDA0)',
	[Trend.DOWN]: 'var(--color-metrics-negative-copy, #FC4A6B)',
	[Trend.NEUTRAL]: 'rgba(250, 250, 250, 1)',
};

export function getPercentData(cell: IPercentCell): IPercentData {
	const numberValue = +cell.value;

	return {
		color: trendToColor[cell.trend],
		value: `${numberValue < 0 ? '−\u00A0' : ''}${Math.abs(numberValue)}%`,
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

	if (isCommoditySymbolCell(symbolCell)) {
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
	groupName: string;
	minWidth: number;
	maxWidth: number;
	width: number;
}

export const columnDisplay: Record<ColumnType, IColumnDisplay> = {
	[ColumnType.Symbol]: {
		columnName: 'Symbol',
		tooltip: 'Symbol',
		settingsName: 'Symbol',
		groupName: 'Symbol',
		minWidth: 100,
		width: 200,
		maxWidth: Infinity,
	},
	[ColumnType.PriceCurrent]: {
		columnName: 'Price',
		tooltip: 'Current price',
		settingsName: 'Current',
		groupName: 'Price',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.PriceMin24h]: {
		columnName: 'Low, 24h',
		tooltip: 'Low price, 24 hours',
		settingsName: 'Low, 24h',
		groupName: 'Price',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.PriceMax24h]: {
		columnName: 'High, 24h',
		tooltip: 'High price, 24 hours',
		settingsName: 'High, 24h',
		groupName: 'Price',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.PriceMin1y]: {
		columnName: 'Low, 1y',
		tooltip: 'Low price, 1 year',
		settingsName: 'Low, Year',
		groupName: 'Price',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.PriceMax1y]: {
		columnName: 'High, 1y',
		tooltip: 'High price, 1 year',
		settingsName: 'High, Year',
		groupName: 'Price',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.PriceAvg50d]: {
		columnName: 'Avg, 50d',
		tooltip: 'Average price, 50 days',
		settingsName: 'Average, 50d',
		groupName: 'Price',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.PriceAvg200d]: {
		columnName: 'Avg, 200d',
		tooltip: 'Average price, 200 days',
		settingsName: 'Average, 200d',
		groupName: 'Price',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Price1yRange]: {
		columnName: 'Range',
		tooltip: 'Price range',
		settingsName: 'Range, 1y',
		groupName: 'Price',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.PriceOpen]: {
		columnName: 'Open',
		tooltip: 'Open',
		settingsName: 'Day',
		groupName: 'Open price',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.PriceClose]: {
		columnName: 'Close',
		tooltip: 'Close price',
		settingsName: 'Previous day',
		groupName: 'Close price',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Price24hChart]: {
		columnName: 'Price, 24h',
		tooltip: 'Price chart, 24 hours',
		settingsName: '24h',
		groupName: 'Price chart',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Price7dChart]: {
		columnName: 'Price, 7d',
		tooltip: 'Price chart, 7 days',
		settingsName: '7d',
		groupName: 'Price chart',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Price30dChart]: {
		columnName: 'Price, 30d',
		tooltip: 'Price chart, 30 days',
		settingsName: '30d',
		groupName: 'Price chart',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.ChangePrice24h]: {
		columnName: 'Chg, 24h',
		tooltip: 'Price change, 24 hours',
		settingsName: '24h',
		groupName: 'Price change',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.ChangePriceYTD]: {
		columnName: 'Chg, 1y',
		tooltip: 'Price change, 1 year',
		settingsName: '1 year',
		groupName: 'Price change',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.ChangePrice1hPercent]: {
		columnName: 'Chg, 1h',
		tooltip: 'Price change, 1 hour',
		settingsName: '1h, %',
		groupName: 'Price change',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.ChangePrice24hPercent]: {
		columnName: 'Chg%, 24h',
		tooltip: 'Price change %, 24 hours',
		settingsName: '24h, %',
		groupName: 'Price change',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.ChangePrice7dPercent]: {
		columnName: 'Chg%, 7d',
		tooltip: 'Price change, 7 days',
		settingsName: '7d, %',
		groupName: 'Price change',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.ChangePrice30dPercent]: {
		columnName: 'Chg%, 30d',
		tooltip: 'Price change, 30 days',
		settingsName: '30d, %',
		groupName: 'Price change',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.ChangePriceYTDPercent]: {
		columnName: 'Chg%, 1y',
		tooltip: 'Price change, 1 year',
		settingsName: '1y, %',
		groupName: 'Price change',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Volume24h]: {
		columnName: 'Volume, 24h',
		tooltip: 'Volume, 24 hours',
		settingsName: '24h',
		groupName: 'Volume',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	// FIXME: Кто такой этот relative volume? Из какого маркета? Я не нашел в макете
	[ColumnType.VolumeRel10d]: {
		columnName: 'Rel vol, 10d',
		tooltip: 'Relative volume, 10 days',
		settingsName: 'Rel vol, 10d',
		groupName: 'Volume',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.VolumeAvg10d]: {
		columnName: 'Avg volume, 10d',
		tooltip: 'Average daily volume, 10 days',
		settingsName: 'Average, 10d',
		groupName: 'Volume',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.VolumeAvg50d]: {
		columnName: 'Avg volume, 50d',
		tooltip: 'Average daily volume, 50 days',
		settingsName: 'Average, 50d',
		groupName: 'Volume',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.MarketCap24h]: {
		columnName: 'Market cap',
		tooltip: 'Market capitalization',
		settingsName: 'Market cap',
		groupName: 'Market cap',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.MarketCapRank]: {
		columnName: 'Mcap rank',
		tooltip: 'Market capitalization rank',
		settingsName: 'Rank',
		groupName: 'Market cap',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.MarketCapFullyDiluted]: {
		columnName: 'FD market cap',
		tooltip: 'Fully diluted market cap',
		settingsName: 'Fully diluted valuation',
		groupName: 'Market cap',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.MarketCapChange24h]: {
		columnName: 'Mcap chg, 24h',
		tooltip: 'Market cap change, 24 hours',
		settingsName: 'Change, 24h',
		groupName: 'Market cap',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.MarketCapChange24hPercent]: {
		columnName: 'Mcap chg%, 24h',
		tooltip: 'Market cap change %, 24 hours',
		settingsName: 'Change 24h, %',
		groupName: 'Market cap',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.CirculatingSupply]: {
		columnName: 'Circ supply',
		tooltip: 'Circulating supply',
		settingsName: 'Circulating',
		groupName: 'Supply',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.TotalSupply]: {
		columnName: 'Total supply',
		tooltip: 'Total supply',
		settingsName: 'Total',
		groupName: 'Supply',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.MaxSupply]: {
		columnName: 'Max supply',
		tooltip: 'Max supply',
		settingsName: 'Max',
		groupName: 'Supply',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.AllTimeHigh]: {
		columnName: 'ATH',
		tooltip: 'All time high',
		settingsName: 'All time high',
		groupName: 'ATH price',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.AllTimeHighChangePercent]: {
		columnName: 'ATH Chg%',
		tooltip: 'All time high change %',
		settingsName: 'Change, %',
		groupName: 'ATH price',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.AllTimeHighDate]: {
		columnName: 'ATH Date',
		tooltip: 'All time high date',
		settingsName: 'Date',
		groupName: 'ATH price',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.AllTimeLow]: {
		columnName: 'ATL',
		tooltip: 'All time low',
		settingsName: 'All time low',
		groupName: 'ATL price',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.AllTimeLowChangePercent]: {
		columnName: 'ATL Chg%',
		tooltip: 'All time low change %',
		settingsName: 'Change, %',
		groupName: 'ATL price',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.AllTimeLowDate]: {
		columnName: 'ATL date',
		tooltip: 'All time low date',
		settingsName: 'Date',
		groupName: 'ATL price',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	// FIXME: А эти два столбца откуда родились? Не могу найти в макете
	[ColumnType.RSIValue]: {
		columnName: 'RSI Value',
		tooltip: 'RSI Value',
		settingsName: 'RSI',
		groupName: 'Technical indicators',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.RSIChart]: {
		columnName: 'RSI Chart',
		tooltip: 'RSI Chart',
		settingsName: 'RSI Chart',
		groupName: 'Technical indicators',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Beta5y]: {
		columnName: 'Beta, 5y',
		tooltip: 'Beta, 5 years',
		settingsName: 'Beta, 5y',
		groupName: 'Beta',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.LastDividend]: {
		columnName: 'Last dividend',
		tooltip: 'Last dividend per share',
		settingsName: 'Last dividend',
		groupName: 'Div Yield',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Employees]: {
		columnName: 'Employees',
		tooltip: 'Number of employees',
		settingsName: 'Employees',
		groupName: 'Company',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.IpODate]: {
		columnName: 'IPO date',
		tooltip: 'Initial public offering date',
		settingsName: 'IPO date',
		groupName: 'Company',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Sector]: {
		columnName: 'Sector',
		tooltip: 'Sector',
		settingsName: 'Sector',
		groupName: 'Company',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Industry]: {
		columnName: 'Industry',
		tooltip: 'Industry',
		settingsName: 'Industry',
		groupName: 'Company',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Source]: {
		columnName: 'Source',
		tooltip: 'Source',
		settingsName: 'Source',
		groupName: 'Source',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	// FIXME: Поидее должно быть в крипто, но в макете нет
	[ColumnType.ListingDate]: {
		columnName: 'Listing Date',
		tooltip: 'Listing date',
		settingsName: 'List',
		groupName: 'Other',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.UpdateDate]: {
		columnName: 'Data updated',
		tooltip: 'Data updated',
		settingsName: 'Time',
		groupName: 'Update date',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Volatility]: {
		columnName: 'Volatility',
		tooltip: 'Volatility',
		settingsName: 'Volatility',
		groupName: 'Other',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.TrustScore]: {
		columnName: 'Trust score',
		tooltip: 'Trust score',
		settingsName: 'Trust score',
		groupName: 'Trust score',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Open]: {
		columnName: 'Is Open',
		tooltip: 'Is open now?',
		settingsName: 'Is open',
		groupName: 'Is open',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Incentive]: {
		columnName: 'Incentive',
		tooltip: 'Incentive',
		settingsName: 'Incentive',
		groupName: 'Incentive',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.MarketHours]: {
		columnName: 'Market hours — some timezone',
		tooltip: 'Market hours — UTC',
		settingsName: 'Market Hours',
		groupName: 'Market Hours',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Volume24hNorm]: {
		columnName: 'Vol norm, 24h',
		tooltip: 'Vol normalized, 24h',
		settingsName:'Vol norm, 24h',
		groupName: 'Volume',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Coins]: {
		columnName: 'Coins',
		tooltip: 'Coins',
		settingsName:'Coins',
		groupName: 'Coins',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Pairs]: {
		columnName: 'Pairs',
		tooltip: 'Pairs',
		settingsName:'Pairs',
		groupName: 'Pairs',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Launched]: {
		columnName: 'Launched',
		tooltip: 'Launched',
		settingsName: 'Launched',
		groupName: 'Launched',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.DEXRank]: {
		columnName: 'Rank',
		tooltip: 'Rank',
		settingsName: 'Rank',
		groupName: 'Rank',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.Country]: {
		columnName: 'Country',
		tooltip: 'Country',
		settingsName: 'Country',
		groupName: 'Country',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.NextClosedDay]: {
		columnName: 'Next closed day',
		tooltip: 'Next closed day',
		settingsName: 'Next closed day',
		groupName: 'Next closed day',
		width: 200,
		minWidth: 100,
		maxWidth: 200,
	},
	[ColumnType.Performance]: {
		columnName: 'Performance',
		tooltip: 'Performance',
		settingsName: 'Performance',
		groupName: 'Performance',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.AnalystRating]: {
		columnName: 'Analyst R.',
		tooltip: 'Analyst rating',
		settingsName: 'Analyst rating',
		groupName: 'Other',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.VolumeRel24h]: {
		columnName: 'R. Vol., 24h',
		tooltip: 'Relative volume, 24 hours',
		settingsName: '24h',
		groupName: 'Rel. volume',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.VolumeRelAvg50d]: {
		columnName: 'R. Vol. Avg., 50d',
		tooltip: 'Average relative volume, 50 days',
		settingsName: '50d',
		groupName: 'Rel. volume',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.PriceEarnings]: {
		columnName: 'P/E',
		tooltip: 'Price to earnings ratio',
		settingsName: 'P/E',
		groupName: 'P/E',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.EpsDil12mo]: {
		columnName: 'EPS dil',
		tooltip: 'EPS diluted, 12 months',
		settingsName: '12mo',
		groupName: 'EPS dil.',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.EpsDilAvg50d]: {
		columnName: 'EPS dil, avg',
		tooltip: 'Average EPS diluted, 50 days',
		settingsName: 'Average, 50d',
		groupName: 'EPS dil.',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.EpsDilGrowth12mo]: {
		columnName: 'EPS dil growth',
		tooltip: 'EPD diluted growth %, 12 months',
		settingsName: '12mo',
		groupName: 'EPS dil. growth',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.EpsDilGrowthAvg50d]: {
		columnName: 'EPS dil growth, avg',
		tooltip: 'Average EPS diluted growth %, 50 days',
		settingsName: 'Average, 50d',
		groupName: 'EPS dil. growth',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
	[ColumnType.DividendYield]: {
		columnName: 'Div yield %',
		tooltip: 'Dividend yield %',
		settingsName: '12mo',
		groupName: 'Div Yield',
		minWidth: 100,
		width: 200,
		maxWidth: 200,
	},
};
