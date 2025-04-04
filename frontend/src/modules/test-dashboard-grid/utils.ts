import { MAX_COL_WIDTH, MAX_ROW_HEIGHT, MIN_COL_WIDTH, MIN_ROW_HEIGHT } from './constants';

export function calculateGrid(screenWidth: number, screenHeight: number) {
	const minCols = Math.floor(screenWidth / MAX_COL_WIDTH);
	const maxCols = Math.floor(screenWidth / MIN_COL_WIDTH);

	let numCols = maxCols;
	let colWidth;

	if (numCols * MIN_COL_WIDTH <= screenWidth) {
		colWidth = Math.min(MAX_COL_WIDTH, Math.floor(screenWidth / numCols));
	} else {
		numCols = minCols;
		colWidth = Math.min(MAX_COL_WIDTH, Math.floor(screenWidth / numCols));
	}

	const minRows = Math.floor(screenHeight / MAX_ROW_HEIGHT);
	const maxRows = Math.floor(screenHeight / MIN_ROW_HEIGHT);

	let numRows = maxRows;
	let rowHeight;

	if (numRows * MIN_ROW_HEIGHT <= screenHeight) {
		rowHeight = Math.min(MAX_ROW_HEIGHT, Math.floor(screenHeight / numRows));
	} else {
		numRows = minRows;
		rowHeight = Math.min(MAX_ROW_HEIGHT, Math.floor(screenHeight / numRows));
	}

	return {
		columns: numCols,
		columnWidth: colWidth,
		rows: numRows,
		rowHeight,
		totalWidth: numCols * colWidth,
		totalHeight: numRows * rowHeight,
	};
}
