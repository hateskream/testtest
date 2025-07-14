import type { IWidget } from '@/modules/dashboard-group/core';

export interface IDashboard {
	id: string;
	widgets: IWidget[];
}
