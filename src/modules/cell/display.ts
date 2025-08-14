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
		shortName: 'Sym',
	},
	[ColumnType.PriceCurrent]: {
		name: 'Current Price',
		shortName: 'Curr',
	},
	[ColumnType.PriceMin24h]: {
		name: '24h Min Price',
		shortName: '24h Min',
	},
	[ColumnType.PriceMax24h]: {
		name: '24h Max Price',
		shortName: '24h Max',
	},
	[ColumnType.PriceMin1y]: {
		name: '1y Min Price',
		shortName: '1y Min',
	},
	[ColumnType.PriceMax1y]: {
		name: '1y Max Price',
		shortName: '1y Max',
	},
	[ColumnType.PriceAvg50d]: {
		name: '50d Avg Price',
		shortName: '50d Avg',
	},
	[ColumnType.PriceAvg200d]: {
		name: '200d Avg Price',
		shortName: '200d Avg',
	},
	[ColumnType.Price1yRange]: {
		name: '1y Price Range',
		shortName: '1y Range',
	},
	[ColumnType.Price24hChart]: {
		name: '24h Price Chart',
		shortName: '24h Chart',
	},
	[ColumnType.Price7dChart]: {
		name: '7d Price Chart',
		shortName: '7d Chart',
	},
	[ColumnType.Price30dChart]: {
		name: '30d Price Chart',
		shortName: '30d Chart',
	},
	[ColumnType.ChangePrice24h]: {
		name: '24h Price Change',
		shortName: 'Δ24h',
	},
	[ColumnType.ChangePrice1hPercent]: {
		name: '1h Price Change (%)',
		shortName: 'Δ1h%',
	},
	[ColumnType.ChangePrice24hPercent]: {
		name: '24h Price Change (%)',
		shortName: 'Δ24h%',
	},
	[ColumnType.ChangePrice7dPercent]: {
		name: '7d Price Change (%)',
		shortName: 'Δ7d%',
	},
	[ColumnType.ChangePrice30dPercent]: {
		name: '30d Price Change (%)',
		shortName: 'Δ30d%',
	},
	[ColumnType.Volume24h]: {
		name: '24h Volume',
		shortName: 'Vol24h',
	},
	[ColumnType.VolumeRel10d]: {
		name: 'Relative 10d Volume',
		shortName: 'Rel10d',
	},
	[ColumnType.VolumeAvg10d]: {
		name: '10d Avg Volume',
		shortName: 'Avg10d',
	},
	[ColumnType.MarketCap24h]: {
		name: '24h Market Cap',
		shortName: 'MCap24h',
	},
	[ColumnType.RSIValue]: {
		name: 'RSI Value',
		shortName: 'RSI',
	},
	[ColumnType.RSIChart]: {
		name: 'RSI Chart',
		shortName: 'RSI Chart',
	},
	[ColumnType.Beta5y]: {
		name: '5y Beta',
		shortName: 'Beta5y',
	},
	[ColumnType.LastDividend]: {
		name: 'Last Dividend',
		shortName: 'Div',
	},
	[ColumnType.Employees]: {
		name: 'Employees',
		shortName: 'Emp',
	},
	[ColumnType.IpODate]: {
		name: 'IPO Date',
		shortName: 'IPO',
	},
	[ColumnType.Sector]: {
		name: 'Sector',
		shortName: 'Sec',
	},
	[ColumnType.Industry]: {
		name: 'Industry',
		shortName: 'Ind',
	},
	[ColumnType.Source]: {
		name: 'Source',
		shortName: 'Src',
	},
	[ColumnType.ListingDate]: {
		name: 'Listing Date',
		shortName: 'List',
	},
	[ColumnType.UpdateDate]: {
		name: 'Update Date',
		shortName: 'Upd',
	},
	[ColumnType.OpenPrice]: {
		name: 'Open Price',
		shortName: 'Open',
	},
	[ColumnType.ClosePrice]: {
		name: 'Close Price',
		shortName: 'Close',
	},
	[ColumnType.VolumeAvg50d]: {
		name: '50d Avg Volume',
		shortName: 'Avg50d',
	},
};
