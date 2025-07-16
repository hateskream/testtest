export type {
	IMeta,
	IWidget,
	IDashboardGroup,
	IPosition,
	IDashboardTab,
	IWidgetPreset,
	IWidgetState,
	ISize,
} from './model';
export { WidgetType } from './model';

export { useDashboardGroupsStore } from './stores/dashboard-group-store';

export { useGridLayout, useLoadDashboard } from './composables';
