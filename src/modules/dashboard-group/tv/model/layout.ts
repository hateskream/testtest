import type { IWidget, IWidgetState } from './widget';

export interface ILayoutItem {
	i: string;
	x: number;
	y: number;
	w: number;
	h: number;
}

function isOffScreen(widget: ILayoutItem, colNum: number): boolean {
	return widget.x + widget.w > colNum;
}

function isWiderThanScreen(widget: ILayoutItem, colNum: number): boolean {
	return widget.w > colNum;
}

function isGridTooWide(dashboards: ILayoutItem[], colNum: number): boolean {
	return dashboards.some(w => isOffScreen(w, colNum) || isWiderThanScreen(w, colNum));
}

function getLastRowInfo(dashboards: ILayoutItem[], widgetWidth: number, colNum: number): { x: number; y: number } {
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
	widget: ILayoutItem,
	x: number,
	y: number,
	dashboards: ILayoutItem[],
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

function optimizeLayoutHeight(dashboards: ILayoutItem[], colNum: number): ILayoutItem[] {
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

function adjustWidgetWidth(dashboards: ILayoutItem[], colNum: number): ILayoutItem[] {
	return dashboards.map(widget =>
		widget.w > colNum ? { ...widget, w: colNum, prevW: widget.w } : widget,
	);
}

export function createGrid(colNum: number, initDashboards: ILayoutItem[]): ILayoutItem[] {
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

export function duplicate(allWidgets: ILayoutItem[], widgetId: string): {
	allWidgets:ILayoutItem[];
	newWidget:ILayoutItem;
}| null {
	const widgets = [...allWidgets.map(w => ({ ...w }))];
	const target = widgets.find(w => w.i === widgetId);
	if (!target) {
		return null;
	}

	const newWidget: ILayoutItem = {
		...target,
		x: target.x + target.w,
		i: `${target.i}_copy_${Date.now()}`,
	};

	function isOverlap(a: ILayoutItem, b: ILayoutItem) {
		return !(
			a.x + a.w <= b.x ||
			b.x + b.w <= a.x ||
			a.y + a.h <= b.y ||
			b.y + b.h <= a.y
		);
	}

	let overlap = true;
	while (overlap) {
		overlap = false;
		for (const w of widgets) {
			if (isOverlap(newWidget, w)) {
				for (const ww of widgets) {
					if (ww.y < w.y + w.h && ww.y + ww.h > w.y && ww.x >= w.x) {
						ww.x += newWidget.w;
					}
				}
				overlap = true;
				break;
			}
		}
	}

	return {
		allWidgets: widgets,
		newWidget,
	};
}

export function moveTo(otherWidgets: ILayoutItem[], widget: ILayoutItem): ILayoutItem {
	let maxY = 0;
	for (const w of otherWidgets) {
		const bottom = w.y + w.h;
		if (bottom > maxY) {
			maxY = bottom;
		}
	}

	return {
		...widget,
		x: 0,
		y: maxY,
	};
}

export function mapToWidgetState(positions: ILayoutItem[]): IWidgetState[] {
	return positions.map(item => ({
		position: item,
		id: item.i,
	}));
}

export function mapToLayoutItem(widgets: IWidget[]): ILayoutItem[] {
	return widgets.map(w => ({
		...w.position,
		i: w.id,
	}));
}
