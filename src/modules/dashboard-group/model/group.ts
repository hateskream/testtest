import type { IWidget } from './dashboard';

export interface IDashboardGroup {
	id: string;
	name: string;
	items: IWidget[];
	isActive: boolean;
	isEditing: boolean;
	market: string;
}

export interface IDashboardTab {
	id: string;
	name: string;
	isActive: boolean;
	isEditing: boolean;
}
