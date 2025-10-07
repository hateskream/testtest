import type { ISize } from './model';

export interface IMeta {
	widgetId: string;
	isResizing: boolean;
	isLoading: boolean;
	market: string;
	name: string;
	size: ISize;
	defaultStateType: string;
}

export type {
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

export { useGridLayout } from './composables';

export { MAX_COL_WIDTH, MAX_ROW_HEIGHT, MIN_COL_WIDTH, MIN_ROW_HEIGHT } from './utils';
