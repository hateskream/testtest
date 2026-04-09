export { type IDashboard, STABLE_DASHBOARD_IDS } from './dashboard';
export { type ISection, type ISectionWheelPayload, changeWidth, changeOrderWidgets } from './section';

export {
	rehydrateWidget,
	changeHeight,
	changeMaxCountRow,
	canChangeHeight,
	calcSizeSideGridCell,
	getMinHeight,
	getHeightContent,
	getWidgetHeight,
	resizeHandlerMapping,
	type IWidget,
	type DisplayVariant,
	type WidgetState,
} from './widget';

export { type IDashboardTab } from './tab';

export * from './dashboard-meta.ts';
export * from './schema.ts';
