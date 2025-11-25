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
	duplicate,
	mapToWidgetState,
} from './model';

export { useGridLayout } from './composables';

// export { useDashboardGroup } from './composables/use-dashboard-group';

// export { useLayout } from './composables/use-layout';

export { MAX_COL_WIDTH, MAX_ROW_HEIGHT, MIN_COL_WIDTH, MIN_ROW_HEIGHT } from './utils';
