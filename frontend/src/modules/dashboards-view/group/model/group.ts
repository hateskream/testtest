import type { IDashboardCollection, IDashboardFolder, IDashboardInstance } from './dashboard';

export interface IDashboardGroup {
	id: string;
	name: string;
	items: (IDashboardInstance | IDashboardFolder | IDashboardCollection)[];
	isActive: boolean;
	market: string;
}

export interface IDashboardTab {
	id: string;
	name: string;
	isActive: boolean;
}
