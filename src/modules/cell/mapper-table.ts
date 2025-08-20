import { TableColumnType } from '../table/type';
import {
	isCryptoSymbolCell,
	isStockSymbolCell,
	isIndexSymbolCell,
	isCommoditySymbolCell,
	isSymbolCell,
	isNumberCell,
	isPercentCell,
	isTextCell,
} from './check';
import type { ITableColumn } from './column';
import { getMagnitudeText } from './display';
import {
	CellType,
	Trend,
	type Cell,
	ColumnType,
} from './domain';
import type { TableRow } from './row';


export const mapToTableColumnType: Record<CellType, TableColumnType> = {
	[CellType.Symbol]: TableColumnType.IMAGE_STRING,
	[CellType.Number]: TableColumnType.NUMBER,
	[CellType.Text]: TableColumnType.TEXT,
	[CellType.Percent]: TableColumnType.PERCENT,

	// нет отображения - заглушка
	[CellType.Label]: TableColumnType.TEXT,
	[CellType.SvgChart]: TableColumnType.TEXT,
	[CellType.Range]: TableColumnType.TEXT,
	[CellType.Empty]: TableColumnType.TEXT,
};

const cellTypeToTableMapper: Record<Exclude<CellType, 'Empty'>, (cell: Cell) => unknown> = {
	[CellType.Symbol]: mapSymbolToTable,
	[CellType.Number]: mapNumberToTable,
	[CellType.Percent]: mapPercentToTable,
	[CellType.Text]: mapTextToTable,
	[CellType.SvgChart]: mapSvgChartToTable,
	[CellType.Range]: mapRangeToTable,
	[CellType.Label]: mapLabelToTable,
};

function mapCellToTable(cell: Cell): unknown {
	if (cell.cellType === CellType.Empty) {
		return mapEmptyToTable(cell);
	}

	return cellTypeToTableMapper[cell.cellType](cell);
}

function mapSymbolToTable(cell: Cell) {
	if (!isSymbolCell(cell)) {
		return mapEmptyToTable(cell);
	}

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

function mapNumberToTable(cell: Cell) {
	if (!isNumberCell(cell)) {
		return mapEmptyToTable(cell);
	}

	return {
		value: cell.value,
		currencySymbol: cell.currencySymbol,
		magnitude: getMagnitudeText(cell.magnitude),
	};
}

function mapPercentToTable(cell: Cell) {
	if (!isPercentCell(cell)) {
		return mapEmptyToTable(cell);
	}

	return {
		value: cell.trend === Trend.UP || cell.trend === Trend.NEUTRAL ? cell.value : `-${cell.value}`,
	};
}

function mapTextToTable(cell: Cell) {
	if (!isTextCell(cell)) {
		return mapEmptyToTable(cell);
	}

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

function mapLabelToTable(_: Cell) {
	return {
		value: '—',
	};
}

export function mapColumn(marketColumns: ITableColumn[]) {
	return marketColumns.map(col => ({
		key: col.columnType.toString(),
		label: col.displayColumnName,
		shortLabel: col.displayShortColumnName,
		position: col.order,
		sortable: true,
		draggable: col.isDraggable,
		visible: col.isShow,
		type: mapToTableColumnType[col.type],
		group: {
			name: col.group.name,
			displayName: col.group.name.charAt(0).toUpperCase() + col.group.name.slice(1),
		},
	}));
}

export function mapRow(ticker: TableRow) {
	const data = Object.values(ColumnType).reduce((acc, columnType) => {
		if (columnType in ticker) {
			const cell = ticker[columnType as keyof TableRow];
			if (typeof cell === 'string' || cell === undefined) {
				return acc;
			}
			acc[columnType] = mapCellToTable(cell);
		}
		return acc;
	}, {} as Record<ColumnType, unknown>);

	return {
		id: ticker.tickerId,
		data,
	};
}
