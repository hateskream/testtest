import {
	CellType,
	ColumnType,
	columnToCell,
} from './domain';
import {
	mapSymbol,
	mapNumber,
	mapPercent,
	mapText,
	mapSvgChart,
	mapRange,
	isEmptyCell,
	type TableRow,
} from '.';
import type { CellDto } from './dto';


// Generic ticker interface with DTO types
export type TableRowDto<T = Partial<Record<ColumnType, CellDto>>> = {
	tickerId: string;
} & T;

/**
 * Universal function to map ticker DTOs to TableRow format
 * @param tickers - Array of ticker DTOs with cell data
 * @returns Array of TableRow objects with mapped cells
 */
export function mapTickersToTableRows<T extends TableRow>(tickers: TableRowDto[]): T[] {
	return tickers
		.map(ticker => {
			const mappedTicker: Partial<TableRow> = {
				tickerId: ticker.tickerId,
			};

			// Iterate through all possible column types and map if present
			Object.values(ColumnType).forEach(columnType => {
				if (columnType in ticker) {
					const cellType = columnToCell[columnType];
					const dto = ticker[columnType];
					if (!dto) {
						// eslint-disable-next-line no-console
						console.error(`No DTO found for column type: ${columnType}`);
						return;
					}

					const mappedCell = mapDtoToCell(cellType, dto);
					if (mappedCell !== null) {
						mappedTicker[columnType] = mappedCell;
					}
				}
			});

			return mappedTicker as T;
		})
		.filter(ticker => {
			// Filter out tickers with all empty cells
			return Object
				.values(ticker)
				.map((maybeCell) => {
					if (typeof maybeCell === 'string') {
						return null;
					}
					return maybeCell;
				})
				.filter(el => el !== null)
				.every(cell => !isEmptyCell(cell));
		});
}

/**
 * Prepare response helper function for market APIs
 * @param data - Response data with tickers and pagination
 * @returns Prepared response with mapped tickers
 */
export function prepareMarketResponse<T extends TableRow>(
	data: {
		tickers: TableRowDto[];
		pagination: { total: number; offset: number; limit: number };
	}): {
		tickers: T[];
		pagination: { total: number; offset: number; limit: number };
	} {
	return {
		tickers: mapTickersToTableRows<T>(data.tickers),
		pagination: data.pagination,
	};
}

function mapDtoToCell(cellType: CellType, dto: CellDto) {
	switch (cellType) {
		case CellType.Symbol:
			return mapSymbol(dto);
		case CellType.Number:
			return mapNumber(dto);
		case CellType.Percent:
			return mapPercent(dto);
		case CellType.Text:
			return mapText(dto);
		case CellType.SvgChart:
			return mapSvgChart(dto);
		case CellType.Range:
			return mapRange(dto);
		default:
			// Handle unknown cell types gracefully
			return null;
	}
}
