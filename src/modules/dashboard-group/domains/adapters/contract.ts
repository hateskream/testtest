import type { DashboardGroup } from '../entities/dashboard-group';

export interface IGetterDashboardGroup {
	Get(): Promise<DashboardGroup>;
}

export interface ISetterDashboardGroup {
	Set(dashboardGroup: DashboardGroup): Promise<void>;
}
