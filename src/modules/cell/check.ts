import {
	CellType,
	SymbolType,
	type Cell,
	type ICommoditySymbolCell,
	type ICryptoSymbolCell,
	type IEmptyCell,
	type IForexSymbolCell,
	type IIndexSymbolCell,
	type ILableCell,
	type INumberCell,
	type IPercentCell,
	type IPlaneTextSymbolCell,
	type IRangeCell,
	type IStockSymbolCell,
	type ISvgChartCell,
	type ISymbolCell,
	type ITextCell, type IScoreCell,
} from './domain';

export function isEmptyCell(cell: Cell): cell is IEmptyCell {
	return cell.cellType === CellType.Empty;
}

export function isCryptoSymbolCell(cell: ISymbolCell): cell is ICryptoSymbolCell {
	return cell.symbolType === SymbolType.Crypto;
}

export function isIndexSymbolCell(cell: ISymbolCell): cell is IIndexSymbolCell {
	return cell.symbolType === SymbolType.Index;
}

export function isCommoditySymbolCell(cell: ISymbolCell): cell is ICommoditySymbolCell {
	return cell.symbolType === SymbolType.Commodity;
}

export function isStockSymbolCell(cell: ISymbolCell): cell is IStockSymbolCell {
	return cell.symbolType === SymbolType.Stock;
}

export function isForexSymbolCell(cell: ISymbolCell): cell is IForexSymbolCell {
	return cell.symbolType === SymbolType.Forex;
}

export function isPlaneTextSymbolCell(cell: ISymbolCell): cell is IPlaneTextSymbolCell {
	return cell.symbolType === SymbolType.PlaneText;
}

export function isSymbolCell(cell: Cell): cell is ISymbolCell {
	return cell.cellType === CellType.Symbol;
}

export function isTextCell(cell: Cell): cell is ITextCell {
	return cell.cellType === CellType.Text;
}

export function isNumberCell(cell: Cell): cell is INumberCell {
	return cell.cellType === CellType.Number;
}

export function isPercentCell(cell: Cell): cell is IPercentCell {
	return cell.cellType === CellType.Percent;
}

export function isSvgChartCell(cell: Cell): cell is ISvgChartCell {
	return cell.cellType === CellType.SvgChart;
}

export function isRangeCell(cell: Cell): cell is IRangeCell {
	return cell.cellType === CellType.Range;
}

export function isLabelCell(cell: Cell): cell is ILableCell {
	return cell.cellType === CellType.Label;
}
export function isScoreCell(cell: Cell): cell is IScoreCell {
	return cell.cellType === CellType.Score;
}
