/* eslint-disable no-console */
import { type Ref } from 'vue';

export interface IDashboardWidgetPosition {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface IDashboardWidget {
	id: string;
	name: string;
	widgetType: string;
	position: IDashboardWidgetPosition;
	description: string;
}

export interface IDashboard {
	id: string;
	name: string;
	order: number;
	widgets: IDashboardWidget[];
}

export interface IDashboardGroupStore {
	activeDashboard: Ref<IDashboard | null>;
	activeDashboardId: Ref<string>;
	dashboards: Ref<IDashboard[]>;
}

export interface IDashboardStateWidget {
	id: string;
	name: string;
	type: string;
	position: IDashboardWidgetPosition;
	description: string;
}

export interface IDashboardState {
	activeDashboardId: string;
	dashboardName: string;
	gridSize: {
		columns: number;
		rows: number;
		rowHeight: number;
		columnWidth: number;
	};
	widgets: IDashboardStateWidget[];
}

export interface IGridInfo {
	columns: number;
	rows: number;
	rowHeight: number;
	columnWidth: number;
	source: string;
}

/**
 * Gets grid layout information from DOM data attributes
 * @returns Grid info object or null if not available
 */
export function getGridInfo(): IGridInfo | null {
	try {
		const gridElement = document.querySelector('[data-dashboard-grid]');
		if (!gridElement) {
			return null;
		}

		const parseAttr = (attr: string) => parseInt(gridElement.getAttribute(attr) || '0', 10);

		const columns = parseAttr('data-grid-columns');
		const rows = parseAttr('data-grid-rows');
		const rowHeight = parseAttr('data-row-height');
		const columnWidth = parseAttr('data-column-width');

		if (columns > 0 && rows > 0) {
			return {
				columns,
				rows,
				rowHeight,
				columnWidth,
				source: 'useGridLayout-data-attributes',
			};
		}

		return null;
	} catch (error) {
		console.error('Failed to get grid info:', error);
		return null;
	}
}

/**
 * Gets the current dashboard state including grid size and widget positions
 * @param store Dashboard group store
 * @returns Dashboard state object or null if no active dashboard
 */
export function getDashboardState(store: IDashboardGroupStore): IDashboardState | null {
	try {
		if (!store) {
			if (import.meta.env.MODE === 'development') {
				console.warn('Dashboard store is not available');
			}
			return null;
		}

		const { activeDashboard, activeDashboardId } = store;
		const dashboard = activeDashboard.value;

		if (!dashboard || !dashboard.widgets?.length) {
			return null;
		}

		const gridSize =
			getGridInfo() ?? { columns: 0, rows: 0, rowHeight: 0, columnWidth: 0 };

		const widgets: IDashboardStateWidget[] = dashboard.widgets.map(
			({ id, name, widgetType, position, description }) => ({
				id,
				name,
				type: widgetType,
				position: { ...position },
				description,
			}),
		);

		return {
			activeDashboardId: activeDashboardId.value,
			dashboardName: dashboard.name,
			gridSize,
			widgets,
		};
	} catch (error) {
		if (import.meta.env.MODE === 'development') {
			console.error('Failed to get dashboard state:', error);
		}
		return null;
	}
}

/**
 * Gets list of all dashboards with basic info
 * @param store Dashboard group store
 * @returns Array of dashboard info objects
 */
export function getAllDashboards(store: IDashboardGroupStore) {
	try {
		if (!store) {
			if (import.meta.env.MODE === 'development') {
				console.warn('Dashboard store is not available');
			}
			return [];
		}

		const { dashboards } = store;

		return dashboards.value.map(({ id, name, order, widgets }) => ({
			id,
			name,
			order,
			widgetsCount: widgets.length,
		}));
	} catch (error) {
		if (import.meta.env.MODE === 'development') {
			console.error('Failed to get dashboards list:', error);
		}
		return [];
	}
}

/**
 * Debug function to log dashboard state information
 * Only works in development mode
 */
export function debugDashboardState(store: IDashboardGroupStore) {
	if (import.meta.env.MODE !== 'development') {
		return;
	}

	console.group('Debug Dashboard State');

	const state = getDashboardState(store);
	const gridInfo = getGridInfo();
	const allDashboards = getAllDashboards(store);

	console.log('Current dashboard:', state);
	console.log('Grid info:', gridInfo);
	console.log('All dashboards:', allDashboards);

	if (state) {
		console.log(`Statistics:
		- Widgets: ${state.widgets.length}
		- Grid size: ${state.gridSize.columns}x${state.gridSize.rows}
		- Cell size: ${state.gridSize.columnWidth}x${state.gridSize.rowHeight}px
		- Widget types: ${[...new Set(state.widgets.map(({ type }) => type))].join(', ')}`);
	}

	console.groupEnd();
}

export function generateDashboardLayout(
	key: number,
	widgets: IDashboardWidget[],
): unknown {
	const formatted = widgets.map((w) => ({
		id: w.id,
		type: w.widgetType,
		position: {
			x: w.position.x,
			y: w.position.y,
			size: {
				w: w.position.w,
				h: w.position.h,
			},
		},
	}));

	console.log('colNum', key);
	console.log(JSON.stringify(formatted, null, 2)); // красиво для копирования
	return formatted;
}

// Export utility functions for global access
export const dashboardStateUtility = {
	getDashboardState,
	getAllDashboards,
	getGridInfo,
	debugDashboardState,
	generateDashboardLayout,
};
