export {
	type IDashboardTab,
	type IDashboardGroup,
	createDashboardGroup,
	getDashboardsByColNum,
	addNewDashboard,
	renameDashboard,
	changeActiveDashboard,
	changeWidgetsState,
	deleteWidget,
	addWidget,
} from './dashboard-group';

export { type IDashboard } from './dashboard';

export { type IWidgetPreset, WidgetType, type IPosition, type IWidget, type IWidgetState, allWidgets } from './widget';
