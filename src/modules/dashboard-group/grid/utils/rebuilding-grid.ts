import type { IPosition } from '../model';

function isOffScreen(widget: IPosition, colNum: number): boolean {
	return widget.x + widget.w > colNum;
}

function isWiderThanScreen(widget: IPosition, colNum: number): boolean {
	return widget.w > colNum;
}

function isGridTooWide(dashboards: IPosition[], colNum: number): boolean {
	return dashboards.some(w => isOffScreen(w, colNum) || isWiderThanScreen(w, colNum));
}

function getLastRowInfo(dashboards: IPosition[], widgetWidth: number, colNum: number): { x: number; y: number } {
	const lastRow = Math.max(0, ...dashboards.map(w => w.y + w.h));
	const lastRowWidgets = dashboards.filter(w => w.y + w.h > lastRow - 1 && w.y <= lastRow);

	for (let x = 0; x <= colNum - widgetWidth; x += 1) {
		if (!lastRowWidgets.some(w => x < w.x + w.w && x + widgetWidth > w.x)) {
			return { x, y: lastRow - 1 };
		}
	}
	return { x: 0, y: lastRow };
}

function canPlaceWidget(
	widget: IPosition,
	x: number,
	y: number,
	dashboards: IPosition[],
): boolean {
	return !dashboards.some(
		w =>
			w.i !== widget.i &&
      y < w.y + w.h &&
      y + widget.h > w.y &&
      x < w.x + w.w &&
      x + widget.w > w.x,
	);
}

function optimizeLayoutHeight(dashboards: IPosition[], colNum: number): IPosition[] {
	let updatedDashboards = dashboards;
	const prevHeight = Math.max(0, ...updatedDashboards.map(w => w.y + w.h));

	const sortedWidgets = updatedDashboards.sort((a, b) => b.y + b.h - (a.y + a.h));

	for (const widget of sortedWidgets) {
		for (let y = 0; y < widget.y; y += 1) {
			for (let x = 0; x <= colNum - widget.w; x += 1) {
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
	return newHeight < prevHeight ? optimizeLayoutHeight(updatedDashboards, colNum) : updatedDashboards;
}

function adjustWidgetWidth(dashboards: IPosition[], colNum: number): IPosition[] {
	return dashboards.map(widget =>
		widget.w > colNum ? { ...widget, w: colNum, prevW: widget.w } : widget,
	);
}

export function createGrid(colNum: number, initDashboards: IPosition[]): IPosition[] {
	let updatedDashboards = initDashboards;

	let isModified = false;

	while (isGridTooWide(updatedDashboards, colNum)) {
		isModified = true;
		const widget = updatedDashboards.find(w => isOffScreen(w, colNum));
		if (!widget) {
			break;
		}

		updatedDashboards = adjustWidgetWidth(updatedDashboards, colNum);
		const { x, y } = getLastRowInfo(updatedDashboards, widget.w, colNum);
		updatedDashboards = updatedDashboards.map(w => (w.i === widget.i ? { ...w, x, y } : w));
	}

	if (isModified) {
		return optimizeLayoutHeight(updatedDashboards, colNum);
	} else {
		return updatedDashboards;
	}
}
