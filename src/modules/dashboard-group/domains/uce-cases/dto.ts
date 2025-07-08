export interface IDashboardGroup {
	activeDashboardId: string;
	dashboards: IDashboard[];
}

export interface IDashboard {
	id: string;
	name: string;
	order: number;
	widgets: IWidget[];
}

export interface IWidget {
	id: string;
	widgetType: string;
	name: string;
	description: string;
	position: IPosition;
	maxSize: ISize;
	minSize: ISize;
}

export interface IPosition {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface ISize {
	w: number;
	h: number;
}

export interface IWidgetPreset {
	widgetType: string;
	name: string;
	description: string;
	maxSize: ISize;
	minSize: ISize;
	defaultSize: ISize;
}

export interface IWidgetState {
	id: string;
	position: IPosition;
}
