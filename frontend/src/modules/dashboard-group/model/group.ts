import type { IDashboardStack, IDashboardFolder, IDashboardInstance } from './dashboard';

export interface IDashboardGroup {
	id: string;
	name: string;
	items: (IDashboardInstance | IDashboardFolder | IDashboardStack)[];
	isActive: boolean;
	market: string;
}

export interface IDashboardTab {
	id: string;
	name: string;
	isActive: boolean;
}
