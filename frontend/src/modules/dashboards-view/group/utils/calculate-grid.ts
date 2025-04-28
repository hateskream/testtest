const MIN_COL_WIDTH = 156;
const MAX_COL_WIDTH = 231;
const MIN_ROW_HEIGHT = 55;
const MAX_ROW_HEIGHT = 73;

export function calculateGrid(screenWidth: number, screenHeight: number) {
	const optimalColumn = calculateOptimalColumn(screenWidth, MIN_COL_WIDTH, MAX_COL_WIDTH);
	const column = calculateSegment(optimalColumn, screenWidth);

	const optimalRow = calculateOptimalRow(screenHeight, MIN_ROW_HEIGHT, MAX_ROW_HEIGHT);
	const row = calculateSegment(optimalRow, screenHeight);

	return {
		columns: column.segmentsCount,
		columnWidth: column.segmentSize,
		rows: row.segmentsCount,
		rowHeight: row.segmentSize,
		totalWidth: column.totalLengthCovered,
		totalHeight: row.totalLengthCovered,
	};
}

interface ISegmentInfo {
	segmentsCount: number;
	segmentSize: number;
	totalLengthCovered: number;
}

function calculateSegment(
	{ segmentsCount, segmentSize, totalLengthCovered }: ISegmentInfo,
	screenWidth: number,
): ISegmentInfo {
	const delta = screenWidth - totalLengthCovered;

	if (delta <= 0) {
		return {
			segmentsCount,
			segmentSize,
			totalLengthCovered,
		};
	}

	const incrementation = delta / segmentsCount;

	return {
		segmentsCount,
		segmentSize: segmentSize + incrementation,
		totalLengthCovered: segmentsCount * (segmentSize + incrementation),
	};
}

function calculateOptimalRow(
	totalLength: number,
	minSegmentSize: number,
	maxSegmentSize: number,
): ISegmentInfo {
	let segmentOptions = calculateOptimalSegments(totalLength, minSegmentSize, maxSegmentSize);

	segmentOptions = segmentOptions.sort((a, b) => b.totalLengthCovered - a.totalLengthCovered);

	return segmentOptions[0];
}

function calculateOptimalColumn(
	totalLength: number,
	minSegmentSize: number,
	maxSegmentSize: number,
): ISegmentInfo {
	let segmentOptions = calculateOptimalSegments(totalLength, minSegmentSize, maxSegmentSize);

	segmentOptions = segmentOptions
		.sort((a, b) => b.totalLengthCovered - a.totalLengthCovered)
		.filter(el => el.segmentsCount % 2 === 0);

	return segmentOptions[0];
}

function calculateOptimalSegments(
	totalLength: number,
	minSegmentSize: number,
	maxSegmentSize: number,
): ISegmentInfo[] {
	let currentSegmentSize = maxSegmentSize;

	const segmentOptions: ISegmentInfo[] = [];

	while (currentSegmentSize >= minSegmentSize) {
		const segmentsCount = Math.floor(totalLength / currentSegmentSize);
		const totalLengthCovered = segmentsCount * currentSegmentSize;

		segmentOptions.push({
			segmentsCount,
			segmentSize: currentSegmentSize,
			totalLengthCovered,
		});

		currentSegmentSize -= 1;
	}

	return segmentOptions;
}

export function calculateRows(screenHeight: number, fixedRowHeight: number) {
	const numRows = Math.floor(screenHeight / fixedRowHeight);

	const finalRows = Math.max(1, numRows);

	return {
		rows: finalRows,
		rowHeight: fixedRowHeight,
		totalHeight: finalRows * fixedRowHeight,
	};
}
