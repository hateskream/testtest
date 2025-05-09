import type { WidgetType } from './widgets';

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

export interface IPositionWithId extends IPosition {
	i: number;
}

export enum DashboardItemType {
	Instance = 'instance',
	Stack = 'stack',
	Folder = 'folder',
}

export interface IDashboardItem {
	type: DashboardItemType;
	name: string;
	id: number;
	position: IPosition;
	maxSize: ISize;
	minSize: ISize;
}

export interface IDashboardInstance extends IDashboardItem {
	type: DashboardItemType.Instance;
	dashboardType: WidgetType;
	isResizing?: boolean;
}

export interface IDashboardStack extends IDashboardItem {
	type: DashboardItemType.Stack;
	items: (IDashboardInstance | IDashboardFolder)[];
}

export interface IDashboardFolder extends IDashboardItem {
	type: DashboardItemType.Folder;
	items: IDashboardInstance[];
}
