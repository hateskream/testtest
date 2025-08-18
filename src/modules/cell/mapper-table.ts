import { TableColumnType } from '../table/type';
import {
	isCryptoSymbolCell,
	isStockSymbolCell,
	isIndexSymbolCell,
	isCommoditySymbolCell,
	isSymbolCell,
	isNumberCell,
	isPercentCell,
	isRangeCell,
	isSvgChartCell,
	isTextCell,
} from './check';
import { getMagnitudeText } from './display';
import {
	CellType,
	type ISymbolCell,
	type INumberCell,
	type IPercentCell,
	Trend,
	type ITextCell,
	type Cell,
} from './domain';


export const mapToTableColumnType: Record<CellType, TableColumnType> = {
	[CellType.Symbol]: TableColumnType.IMAGE_STRING,
	[CellType.Number]: TableColumnType.NUMBER,
	[CellType.Text]: TableColumnType.TEXT,
	[CellType.Percent]: TableColumnType.PERCENT,

	// нет отображения - заглушка
	[CellType.SvgChart]: TableColumnType.TEXT,
	[CellType.Range]: TableColumnType.TEXT,
	[CellType.Empty]: TableColumnType.TEXT,
};

export function mapCellToTable(cell: Cell) {
	if (isSymbolCell(cell)) {
		return mapSymbolToTable(cell);
	}

	if (isNumberCell(cell)) {
		return mapNumberToTable(cell);
	}

	if (isPercentCell(cell)) {
		return mapPercentToTable(cell);
	}

	if (isTextCell(cell)) {
		return mapTextToTable(cell);
	}

	if (isSvgChartCell(cell)) {
		return mapSvgChartToTable(cell);
	}

	if (isRangeCell(cell)) {
		return mapRangeToTable(cell);
	}

	return mapEmptyToTable(cell);
}

function mapSymbolToTable(cell: ISymbolCell) {
	if (isCryptoSymbolCell(cell)) {
		return {
			symbolType: cell.symbolType,
			srcImg: cell.srcImg,
			ticker: cell.ticker,
			blockchain: cell.blockchain,
		};
	}

	if (isStockSymbolCell(cell)) {
		return {
			symbolType: cell.symbolType,
			srcImg: cell.srcImg,
			ticker: cell.ticker,
			companyName: cell.companyName,
		};
	}

	if (isIndexSymbolCell(cell)) {
		return {
			symbolType: cell.symbolType,
			srcImg: cell.srcImg,
			ticker: cell.ticker,
			indexName: cell.indexName,
		};
	}

	if (isCommoditySymbolCell(cell)) {
		return {
			symbolType: cell.symbolType,
			srcImg: cell.srcImg,
			ticker: cell.ticker,
			commodityName: cell.commodityName,
		};
	}

	return {
		symbolType: cell.symbolType,
		rightSrcImg: cell.rightSrcImg,
		leftSrcImg: cell.leftSrcImg,
		rightTicker: cell.rightTicker,
		leftTicker: cell.leftTicker,
	};
}

function mapNumberToTable(cell: INumberCell) {
	return {
		value: cell.value,
		currencySymbol: cell.currencySymbol,
		magnitude: getMagnitudeText(cell.magnitude),
	};
}

function mapPercentToTable(cell: IPercentCell) {
	return {
		value: cell.trend === Trend.UP || cell.trend === Trend.NEUTRAL ? cell.value : `-${cell.value}`,
	};
}

function mapTextToTable(cell: ITextCell) {
	return {
		value: cell.value,
	};
}

function mapSvgChartToTable(_: Cell) {
	return {
		value: '—',
	};
}

function mapRangeToTable(_: Cell) {
	return {
		value: '—',
	};
}

function mapEmptyToTable(_: Cell) {
	return {
		value: '—',
	};
}
