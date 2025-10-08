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
	areDashboardGroupsEqual,
	changeActiveColumnNum,
} from './dashboard-group';

export { type IDashboard } from './dashboard';

export {
	type IWidgetPreset,
	WidgetType,
	type IPosition,
	type IWidget,
	type IWidgetState,
	allWidgets,
	type ISize,
	rehydrateWidget,
} from './widget';

export * from './layout';
