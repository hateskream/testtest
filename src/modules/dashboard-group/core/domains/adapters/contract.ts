import type { DashboardGroup } from '../entities/dashboard-group';

export interface IGetterDashboardGroup {
	Get(): Promise<DashboardGroup>;
}

export interface ISetterDashboardGroup {
	Set(dashboardGroup: DashboardGroup): Promise<void>;
}

export interface IRepository extends IGetterDashboardGroup, ISetterDashboardGroup {}
