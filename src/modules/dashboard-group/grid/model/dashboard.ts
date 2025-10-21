import type { IWidget } from '@/modules/dashboard-group/tv';

export interface IDashboard {
	id: string;
	name: string;
	widgets: IWidget[];
}
