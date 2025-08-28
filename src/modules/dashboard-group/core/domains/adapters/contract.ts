import type { DashboardGroup } from '../entities/dashboard-group';

export interface IGetterDashboardGroup {
	Get(): Promise<DashboardGroup>;
}

export interface ISetterDashboardGroup {
	Set(dashboardGroup: DashboardGroup): Promise<void>;
}

export interface IRepository extends IGetterDashboardGroup, ISetterDashboardGroup {}

export interface IRemoveWidgetPort {
	produceRemove(widgetType: string, widgetId: string): void;
}

export interface IAddWidgetPort {
	produceAdd(widgetType: string, widgetId: string): void;
}

export interface IWidgetProducer extends IRemoveWidgetPort, IAddWidgetPort {}
