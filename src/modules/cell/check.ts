import {
	CellType,
	SymbolType,
	type Cell,
	type ICommoditySymbolCell,
	type ICryptoSymbolCell,
	type IEmptyCell,
	type IForexSymbolCell,
	type IIndexSymbolCell,
	type IStockSymbolCell,
	type ISymbolCell,
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
