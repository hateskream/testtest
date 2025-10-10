export type {
	IWidget,
	IDashboardGroup,
	IPosition,
	IDashboardTab,
	IWidgetPreset,
	IWidgetState,
	ISize,
	ILayoutItem,
} from './model';

export {
	WidgetType,
	duplicate,
	mapToWidgetState,
} from './model';

export { useGridLayout, useDashboardGroup, useLayout } from './composables';

export { MAX_COL_WIDTH, MAX_ROW_HEIGHT, MIN_COL_WIDTH, MIN_ROW_HEIGHT } from './utils';
