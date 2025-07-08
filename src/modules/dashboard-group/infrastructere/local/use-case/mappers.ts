import { Dashboard } from '@/modules/dashboard-group/domains/entities/dashboard';
import { Widget } from '@/modules/dashboard-group/domains/entities/widget';
import { PresetWidget } from '@/modules/dashboard-group/domains/entities/widget';
import type { IDashboard, IWidget, IWidgetPreset } from '@/modules/dashboard-group/domains/uce-cases';

export function mapDashboards(dashboards: Dashboard[]): IDashboard[] {
	return dashboards.map(mapDashboard);
}

export function mapDashboard(dashboard: Dashboard): IDashboard {
	return {
		id: dashboard.id,
		name: dashboard.name,
		order: dashboard.order,
		widgets: mapWidgets(dashboard.widgets),
	};
}

export function mapWidgets(widgets: Widget[]): IWidget[] {
	return widgets.map(mapWidget);
}

export function mapWidgetsPreset(widgets: PresetWidget[]): IWidgetPreset[] {
	return widgets.map(w => ({
		widgetType: w.widgetType,
		name: w.name,
		description: w.description,
		maxSize: w.maxSize,
		minSize: w.minSize,
		defaultSize: w.defaultSize,
	}));
}

export function mapWidget(widget: Widget): IWidget {
	return {
		id: widget.id,
		name: widget.name,
		description: widget.description,
		position: widget.position,
		maxSize: widget.maxSize,
		minSize: widget.minSize,
		widgetType: widget.widgetType,
	};
}
