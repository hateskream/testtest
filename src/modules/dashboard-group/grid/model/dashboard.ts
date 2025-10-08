import type { IWidget } from '@/modules/dashboard-group/core';

export interface IDashboard {
	id: string;
	name: string;
	widgets: IWidget[];
}
