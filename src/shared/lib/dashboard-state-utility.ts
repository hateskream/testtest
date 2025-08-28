/* eslint-disable no-console */
import { useDashboardGroupsStore } from '@/modules/dashboard-group/core/stores/dashboard-group-store';

export interface IDashboardStateWidget {
	id: string;
	name: string;
	type: string;
	position: {
		x: number;
		y: number;
		w: number;
		h: number;
	};
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

/**
 * Gets the current dashboard state including grid size and widget positions
 * Uses existing data from dashboard store and grid layout
 * @returns Dashboard state object or null if no active dashboard
 */
export function getDashboardState(): IDashboardState | null {
	try {
		const store = useDashboardGroupsStore();
		if (!store) {
			if (import.meta.env.MODE === 'development') {
				console.warn('Dashboard store is not available');
			}
			return null;
		}

		const { activeDashboard, activeDashboardId } = store;

		if (!activeDashboard?.widgets) {
			return null;
		}

		// Get grid dimensions from data attributes set by useGridLayout
		const gridElement = document.querySelector('[data-dashboard-grid]');
		let gridSize = { columns: 0, rows: 0, rowHeight: 0, columnWidth: 0 };

		if (gridElement) {
			gridSize = {
				columns: parseInt(gridElement.getAttribute('data-grid-columns') || '0', 10),
				rows: parseInt(gridElement.getAttribute('data-grid-rows') || '0', 10),
				rowHeight: parseInt(gridElement.getAttribute('data-row-height') || '0', 10),
				columnWidth: parseInt(gridElement.getAttribute('data-column-width') || '0', 10),
			};
		}

		// Map widget data from store
		const widgets: IDashboardStateWidget[] = activeDashboard.widgets.map(({
			id,
			name,
			widgetType,
			position,
			description,
		}) => ({
			id,
			name,
			type: widgetType,
			position: {
				x: position.x,
				y: position.y,
				w: position.w,
				h: position.h,
			},
			description,
		}));

		return {
			activeDashboardId,
			dashboardName: activeDashboard.name,
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
 * @returns Array of dashboard info objects
 */
export function getAllDashboards() {
	try {
		const store = useDashboardGroupsStore();
		if (!store) {
			if (import.meta.env.MODE === 'development') {
				console.warn('Dashboard store is not available');
			}
			return [];
		}

		const { dashboards } = store;

		return dashboards.map(({ id, name, order, widgets }) => ({
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
 * Gets grid layout information from DOM data attributes
 * @returns Grid info object or null if not available
 */
export function getGridInfo() {
	try {
		const gridElement = document.querySelector('[data-dashboard-grid]');

		if (gridElement) {
			const columns = parseInt(gridElement.getAttribute('data-grid-columns') || '0', 10);
			const rows = parseInt(gridElement.getAttribute('data-grid-rows') || '0', 10);
			const rowHeight = parseInt(gridElement.getAttribute('data-row-height') || '0', 10);
			const columnWidth = parseInt(gridElement.getAttribute('data-column-width') || '0', 10);

			if (columns > 0 && rows > 0) {
				return {
					columns,
					rows,
					rowHeight,
					columnWidth,
					source: 'useGridLayout-data-attributes',
				};
			}
		}

		return null;
	} catch (error) {
		console.error('Failed to get grid info:', error);
		return null;
	}
}

/**
 * Debug function to log dashboard state information
 * Only works in development mode
 */
export function debugDashboardState() {
	if (import.meta.env.MODE !== 'development') {
		return;
	}

	console.group('Debug Dashboard State');

	const state = getDashboardState();
	const gridInfo = getGridInfo();
	const allDashboards = getAllDashboards();

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

// Export utility functions for global access
export const dashboardStateUtility = {
	getDashboardState,
	getAllDashboards,
	getGridInfo,
	debugDashboardState,
};
