export { type IDashboardGroup, createDashboardGroup, changeActiveDashboard } from './dashboard-group';

export { type ISection, type ISectionWheelPayload, changeWidth, changeOrderWidgets } from './section';

export {
	rehydrateWidget,
	changeHeight,
	changeMaxCountRow,
	canChangeHeight,
	calcSizeSideGridCell,
	getMinHeight,
	calcMaxCountRowVisible,
	snapHeightToNearestStep,
	type IWidget,
	type DisplayVariant,
} from './widget';

export { type IDashboardTab } from './tab';
