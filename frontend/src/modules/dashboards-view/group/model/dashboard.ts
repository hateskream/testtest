import type { WidgetType } from './widgets';

export interface IPosition {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface IPositionWithId extends IPosition {
	i: number;
}

export enum DashboardItemType {
	Instance = 'instance',
	Collection = 'collection',
	Folder = 'folder',
}

export interface IDashboardItem {
	type: DashboardItemType;
	name: string;
	id: number;
	position: IPosition;
}

export interface IDashboardInstance extends IDashboardItem {
	type: DashboardItemType.Instance;
	dashboardType: WidgetType;
	isResizing?: boolean;
}

export interface IDashboardCollection extends IDashboardItem {
	type: DashboardItemType.Collection;
	items: (IDashboardInstance | IDashboardFolder)[];
}

export interface IDashboardFolder extends IDashboardItem {
	type: DashboardItemType.Folder;
	items: IDashboardInstance[];
}
