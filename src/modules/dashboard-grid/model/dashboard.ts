import type { IWidget } from '@/modules/dashboard-group';

export interface IDashboard {
	id: string;
	widgets: IWidget[];
}
