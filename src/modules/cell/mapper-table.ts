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
	isLabelCell,
	isSvgChartCell,
	isRangeCell,
	isForexSymbolCell,
	isScoreCell, isOpenCell, isCheckCell, isScheduleCell,
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
	[CellType.Label]: TableColumnType.PLATE,
	[CellType.SvgChart]: TableColumnType.CHART,
	[CellType.Range]: TableColumnType.RANGE,
	[CellType.Empty]: TableColumnType.TEXT,
	[CellType.Score]: TableColumnType.SCORE,
	[CellType.Open]: TableColumnType.IS_OPEN,
	[CellType.Check]: TableColumnType.CHECK,
	[CellType.Schedule]: TableColumnType.SCHEDULE,
};

const cellTypeToTableMapper: Record<Exclude<CellType, 'Empty'>, (cell: Cell) => unknown> = {
	[CellType.Symbol]: mapSymbolToTable,
	[CellType.Number]: mapNumberToTable,
	[CellType.Percent]: mapPercentToTable,
	[CellType.Text]: mapTextToTable,
	[CellType.SvgChart]: mapSvgChartToTable,
	[CellType.Range]: mapRangeToTable,
	[CellType.Label]: mapLabelToTable,
	[CellType.Score]: mapScoreToTable,
	[CellType.Open]: mapOpenToTable,
	[CellType.Check]: mapCheckToTable,
	[CellType.Schedule]: mapScheduleToTable,
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

	if (isForexSymbolCell(cell)) {
		return {
			symbolType: cell.symbolType,
			rightSrcImg: cell.rightSrcImg,
			leftSrcImg: cell.leftSrcImg,
			rightTicker: cell.rightTicker,
			leftTicker: cell.leftTicker,
		};
	}

	return {
		symbolType: cell.symbolType,
		text: cell.text,
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

function mapScoreToTable(cell: Cell) {
	if (!isScoreCell(cell)) {
		return mapEmptyToTable(cell);
	}
	return {
		cellType: CellType.Score,
		value: cell.value,
		score: cell.score,
	};
}


function mapOpenToTable(cell: Cell) {
	if (!isOpenCell(cell)) {
		return mapEmptyToTable(cell);
	}
	return {
		cellType: CellType.Open,
		value: cell.value,
	};
}

function mapPercentToTable(cell: Cell) {
	if (!isPercentCell(cell)) {
		return mapEmptyToTable(cell);
	}

	return {
		value: cell.trend === Trend.UP || cell.trend === Trend.NEUTRAL ? cell.value : `-${cell.value}`,
		maxAbsValue: cell.maxAbsValue,
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

function mapLabelToTable(cell: Cell) {
	if (!isLabelCell(cell)) {
		return mapEmptyToTable(cell);
	}

	return {
		value: cell.value,
	};
}


function mapCheckToTable(cell: Cell) {
	if (!isCheckCell(cell)) {
		return mapEmptyToTable(cell);
	}

	return {
		value: cell.value,
	};
}


function mapScheduleToTable(cell: Cell) {
	if (!isScheduleCell(cell)) {
		return mapEmptyToTable(cell);
	}

	return {
		start: cell.start,
		finish: cell.finish,
		current: cell.current,
	};
}

function mapSvgChartToTable(cell: Cell) {
	if (!isSvgChartCell(cell)) {
		return mapEmptyToTable(cell);
	}

	return {
		src: cell.src,
	};
}

function mapRangeToTable(cell: Cell) {
	if (!isRangeCell(cell)) {
		return mapEmptyToTable(cell);
	}

	return {
		startValue: cell.startValue,
		endValue: cell.endValue,
		currencySymbol: cell.currencySymbol,
		startMagnitude: getMagnitudeText(cell.startMagnitude),
		endMagnitude: getMagnitudeText(cell.endMagnitude),
	};
}

function mapEmptyToTable(_: Cell) {
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
		width: col.width ? col.width : 0,
		maxWidth: col.maxWidth,
		minWidth: col.minWidth,
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
