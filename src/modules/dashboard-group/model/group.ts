import type { IWidget } from './dashboard';

export interface IDashboardGroup {
	id: string;
	name: string;
	items: IWidget[];
	isActive: boolean;
	market: string;
}

export interface IDashboardTab {
	id: string;
	name: string;
	isActive: boolean;
}
