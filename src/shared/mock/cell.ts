import {
	type Cell,
	CellType,
	type ColumnToCell,
	ColumnType,
	type ColumnWithoutSymbol,
	createTickerId,
	type ICommoditySymbolCell,
	type ICryptoSymbolCell,
	type IForexSymbolCell,
	type IIndexSymbolCell,
	type INumberCell,
	type IPercentCell,
	type IPlaneTextSymbolCell,
	type IRangeCell,
	type IStockSymbolCell,
	type ISymbolCell,
	type RowCells,
	SymbolType,
	type TableRow,
} from '@/modules/cell';
import { useFetchMock } from './fetch-mock';

type AllTickersType = Record<SymbolType, ITickerData[]>;
type AllCellsType = Record<ColumnWithoutSymbol, Cell>;

const { getMock:getAllTickers } = useFetchMock<AllTickersType>('/mock/tickers/all-tickers.json');
const { getMock:getAllCellByColumn } = useFetchMock<AllCellsType>('/mock/tickers/all-cell.json');

export interface ITickerData {
	left: string;
	right: string;
}

const tickerCount = 50;

export async function generateRows<T extends RowCells = RowCells>(
	type: SymbolType,
	cols: ColumnWithoutSymbol[],
	countRows = tickerCount,
): Promise<TableRow<T>[]> {
	const [allTickers, allCellByColumn] = await Promise.all([
		getAllTickers(),
		getAllCellByColumn(),
	]);

	return allTickers[type]
		.slice(0, countRows)
		.map(tickerData => {
			const tickerCell = createSymbolCell(type, tickerData);

			return {
				tickerId: createTickerId(tickerCell),
				[ColumnType.Symbol]: tickerCell,
				...Object
					.fromEntries(
						cols
							.map(col => [col, allCellByColumn[col]]),
					),
			} as TableRow<T>;
		});
}

type AllRows = {
	tickerId: string;
} & ColumnToCell;

export async function generateAllRows(): Promise<AllRows[]> {
	const allCellByColumn = await getAllCellByColumn();

	const rowPromises = Object.values(SymbolType).map(type =>
		generateRows(
			type,
			Object.keys(allCellByColumn) as ColumnWithoutSymbol[],
		),
	);

	const rowsArray = await Promise.all(rowPromises);

	return rowsArray.flat() as AllRows[];
}

export function randomizeCellData(cell: Cell): Cell {
	switch (cell.cellType) {
		case CellType.Number:
			return randomizeNumberCell(cell as INumberCell);
		case CellType.Percent:
			return randomizePercentCell(cell as IPercentCell);
		case CellType.Range:
			return randomizeRangeCell(cell as IRangeCell);
		default:
			return cell;
	}
}

function randomizeNumberCell(cell: INumberCell): INumberCell {
	return {
		...cell,
		value: (86000 + Math.random() * 2000).toFixed(2),
	};
}

function randomizePercentCell(cell: IPercentCell): IPercentCell {
	return {
		...cell,
		value: (Math.random() * 100).toFixed(2),
	};
}

function randomizeRangeCell(cell: IRangeCell): IRangeCell {
	return {
		...cell,
		startValue: (86000 + Math.random() * 2000).toFixed(2),
		endValue: (86000 + Math.random() * 2000).toFixed(2),
	};
}

const symbolTypeToCell: Record<SymbolType, (td: ITickerData) => ISymbolCell> = {
	[SymbolType.Crypto]: createCryptoSymbolCell,
	[SymbolType.Stock]: createStockSymbolCell,
	[SymbolType.Index]: createIndexSymbolCell,
	[SymbolType.Commodity]: createCommoditySymbolCell,
	[SymbolType.Forex]: createForexSymbolCell,
	[SymbolType.PlaneText]: createPlainTextCell,
};

function createSymbolCell(type: SymbolType, tickerData: ITickerData): ISymbolCell {
	return symbolTypeToCell[type](tickerData);
}

function createCryptoSymbolCell(tickerData: ITickerData): ICryptoSymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.Crypto,
		srcImg: 'wrong.png',
		ticker: tickerData.left,
		blockchain: tickerData.right,
	};
}

function createStockSymbolCell(tickerData: ITickerData): IStockSymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.Stock,
		srcImg: 'wrong.png',
		ticker: tickerData.left,
		companyName: tickerData.right,
	};
}

function createIndexSymbolCell(tickerData: ITickerData): IIndexSymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.Index,
		srcImg: 'wrong.png',
		ticker: tickerData.left,
		indexName: tickerData.right,
	};
}

function createCommoditySymbolCell(tickerData: ITickerData): ICommoditySymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.Commodity,
		srcImg: 'wrong.png',
		ticker: tickerData.left,
		commodityName: tickerData.right,
	};
}

function createForexSymbolCell(tickerData: ITickerData): IForexSymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.Forex,
		leftTicker: tickerData.left,
		rightTicker: tickerData.right,
		leftSrcImg: 'wrong.png',
		rightSrcImg: 'wrong.png',
	};
}

function createPlainTextCell(tickerData: ITickerData): IPlaneTextSymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.PlaneText,
		text: tickerData.left,
	};
}
