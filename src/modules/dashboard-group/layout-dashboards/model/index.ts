export { type IDashboardGroup, createDashboardGroup, changeActiveDashboard } from './dashboard-group';

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
} from './widget';

export { type IDashboardTab } from './tab';
