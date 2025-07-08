import type {
	IDashboard as IDashboardDto,
	IWidget as IWidgetDto,
	IWidgetPreset as IWidgetPresetDto,
} from '../domains/uce-cases';
import type { IDashboard, IWidget, IWidgetPreset, WidgetType } from '../model';

export function mapDashboards(dashboards: IDashboardDto[]): IDashboard[] {
	return dashboards.map(mapDashboard);
}

export function mapDashboard(dashboard: IDashboardDto): IDashboard {
	return {
		id: dashboard.id,
		name: dashboard.name,
		order: dashboard.order,
		widgets: mapWidgets(dashboard.widgets),
	};
}

export function mapWidgets(widgets: IWidgetDto[]): IWidget[] {
	return widgets.map(w => ({
		...w,
		widgetType: w.widgetType as WidgetType,
	}));
}

export function mapWidgetsPreset(widgets: IWidgetPresetDto[]): IWidgetPreset[] {
	return widgets.map(w => ({
		...w,
		widgetType: w.widgetType as WidgetType,
	}));
}
