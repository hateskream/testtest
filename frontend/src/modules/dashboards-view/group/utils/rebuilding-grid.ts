import type { IPositionWithId } from '../model';

function isOffScreen(widget: IPositionWithId, colNum: number) {
	return widget.x + widget.w > colNum;
}

function isWiderThanScreen(widget: IPositionWithId, colNum: number) {
	return widget.w > colNum;
}

function isGridTooWide(currentDashboards: IPositionWithId[], colNum: number) {
	return currentDashboards.some(w => isOffScreen(w, colNum) || isWiderThanScreen(w, colNum));
}

function getLastRowInfo(currentDashboards: IPositionWithId[], widgetWidth: number, colNum: number) {
	const lastRow = Math.max(0, ...currentDashboards.map(w => w.y + w.h));
	const lastRowWidgets = currentDashboards.filter(w => w.y + w.h > lastRow - 1 && w.y <= lastRow);

	// eslint-disable-next-line no-plusplus
	for (let x = 0; x <= colNum - widgetWidth; x++) {
		if (!lastRowWidgets.some(w => x < w.x + w.w && x + widgetWidth > w.x)) {
			return { x, y: lastRow - 1 };
		}
	}
	return { x: 0, y: lastRow };
}

function canPlaceWidget(
	widget: IPositionWithId,
	x: number,
	y: number,
	currentDashboards: IPositionWithId[],
) {
	return !currentDashboards.some(
		w =>
			w.i !== widget.i &&
			y < w.y + w.h &&
			y + widget.h > w.y &&
			x < w.x + w.w &&
			x + widget.w > w.x,
	);
}

function optimizeLayoutHeight(
	currentDashboards: IPositionWithId[],
	colNum: number,
): IPositionWithId[] {
	let updatedDashboards = [...currentDashboards];
	const prevHeight = Math.max(0, ...updatedDashboards.map(w => w.y + w.h));

	const sortedWidgets = [...updatedDashboards].sort((a, b) => b.y + b.h - (a.y + a.h));

	for (const widget of sortedWidgets) {
		// eslint-disable-next-line no-plusplus
		for (let y = 0; y < widget.y; y++) {
			// eslint-disable-next-line no-plusplus
			for (let x = 0; x <= colNum - widget.w; x++) {
				if (canPlaceWidget(widget, x, y, updatedDashboards)) {
					updatedDashboards = updatedDashboards.map(w =>
						w.i === widget.i ? { ...w, x, y } : w,
					);
					break;
				}
			}
		}
	}

	const newHeight = Math.max(0, ...updatedDashboards.map(w => w.y + w.h));
	return newHeight < prevHeight
		? optimizeLayoutHeight(updatedDashboards, colNum)
		: updatedDashboards;
}

function setPrevWidth(currentDashboards: IPositionWithId[]) {
	return currentDashboards.map(w => ({ ...w, w: w.prevW, prevW: w.w }));
}

function adjustWidgetWidth(
	currentDashboards: IPositionWithId[],
	colNum: number,
): IPositionWithId[] {
	return currentDashboards.map(widget =>
		widget.w > colNum ? { ...widget, w: colNum, prevW: widget.w } : widget,
	);
}

export function createGrid(colNum: number, initDashboards: IPositionWithId[]): IPositionWithId[] {
	let updatedDashboards = setPrevWidth([...initDashboards]);

	while (isGridTooWide(updatedDashboards, colNum)) {
		const widget = updatedDashboards.find(isOffScreen);

		if (!widget) {
			break;
		}

		updatedDashboards = adjustWidgetWidth(updatedDashboards, colNum);

		const { x, y } = getLastRowInfo(updatedDashboards, widget.w, colNum);

		updatedDashboards = updatedDashboards.map(w => (w.i === widget.i ? { ...w, x, y } : w));
	}

	return optimizeLayoutHeight(updatedDashboards, colNum);
}
