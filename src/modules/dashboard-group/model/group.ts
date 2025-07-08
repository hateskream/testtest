import type { IDashboardItem } from './dashboard';

export interface IDashboardGroup {
	id: string;
	name: string;
	items: IDashboardItem[];
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
