import { GAP, MAX_COL_WIDTH, MAX_ROW_HEIGHT, MIN_COL_WIDTH, MIN_ROW_HEIGHT } from './constants';

export function calculateGrid(screenWidth: number, screenHeight: number) {
	const minCols = Math.floor(screenWidth / (MAX_COL_WIDTH + GAP));
	const maxCols = Math.floor(screenWidth / (MIN_COL_WIDTH + GAP));

	let numCols = maxCols;
	let colWidth;

	if (numCols * (MIN_COL_WIDTH + GAP) <= screenWidth) {
		colWidth = Math.min(
			MAX_COL_WIDTH,
			Math.floor((screenWidth - (numCols - 1) * GAP) / numCols),
		);
	} else {
		numCols = minCols;
		colWidth = Math.min(
			MAX_COL_WIDTH,
			Math.floor((screenWidth - (numCols - 1) * GAP) / numCols),
		);
	}

	const minRows = Math.floor(screenHeight / (MAX_ROW_HEIGHT + GAP));
	const maxRows = Math.floor(screenHeight / (MIN_ROW_HEIGHT + GAP));

	let numRows = maxRows;
	let rowHeight;

	if (numRows * (MIN_ROW_HEIGHT + GAP) <= screenHeight) {
		rowHeight = Math.min(
			MAX_ROW_HEIGHT,
			Math.floor((screenHeight - (numRows - 1) * GAP) / numRows),
		);
	} else {
		numRows = minRows;
		rowHeight = Math.min(
			MAX_ROW_HEIGHT,
			Math.floor((screenHeight - (numRows - 1) * GAP) / numRows),
		);
	}

	return {
		columns: numCols,
		columnWidth: colWidth,
		rows: numRows,
		rowHeight,
		totalWidth: numCols * colWidth + (numCols - 1) * GAP,
		totalHeight: numRows * rowHeight + (numRows - 1) * GAP,
	};
}
