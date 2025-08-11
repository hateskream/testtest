import { isForexSymbolCell, isCryptoSymbolCell, isStockSymbolCell, isIndexSymbolCell } from './check';
import { Magnitude, type INumberCell, type IPercentCell, Trend, type ISymbolCell } from './domain';

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
