import { updateById } from '@/shared/lib';
import {
	type IDashboardPrivate,
	type IDashboard,
	addWidget as addWidgetInDashboard,
	createEmptyDashboard,
	changeWidgetsState as changeWidgetsStateInDashboard,
	deleteWidget as deleteWidgetInDashboard,
	// getAllWidgetIds as getAllWidgetIdsInDashboard,
	createDashboardFromPreset,
	fromInnerToPublicDashboard,
	setActiveColumn,
} from './dashboard';
import type { IPosition, ISize, IWidget, IWidgetState } from './widget';

export interface IDashboardGroup {
	activeDashboardId: string;
	activeColNum: number;
	dashboards: IDashboardPrivate[];
}

export function getDashboardsByColNum(dg: IDashboardGroup): IDashboard[] {
	return dg.dashboards.map(fromInnerToPublicDashboard);
}

export function addWidget(
	dg: IDashboardGroup,
	type: string,
	position: IPosition,
	widgetsState: IWidgetState[],
): IDashboardGroup {
	return {
		...dg,
		dashboards: updateById(
			dg.dashboards,
			dg.activeDashboardId,
			(d) => addWidgetInDashboard(d, type, position, widgetsState),
		),
	};
}

export function changeActiveDashboard(dg: IDashboardGroup, id: string): IDashboardGroup {
	return {
		...dg,
		activeDashboardId: id,
	};
}

// function changeTabOrder(dg: IDashboardGroup, newOrder: string[]): IDashboardGroup {
// 	const isValid =
// 		dg.dashboards.length === newOrder.length &&
// 		dg.dashboards.every(d => newOrder.includes(d.id));

// 	if (!isValid) {
// 		return dg;
// 	}

// 	return {
// 		...dg,
// 		dashboards: newOrder
// 			.map((id, index) => ({
// 				...dg.dashboards.find(d => d.id === id)!,
// 				order: index,
// 			})),
// 	};
// }

export function addNewDashboard(dg: IDashboardGroup): IDashboardGroup {
	const { activeColNum = 0 } = dg.dashboards[0] || {};

	const newDashboard = createEmptyDashboard(dg.dashboards.length + 1, activeColNum);


	return {
		...dg,
		activeDashboardId: newDashboard.id,
		dashboards: [...dg.dashboards, newDashboard],
	};
}

// function deleteDashboard(dg: IDashboardGroup, id: string): IDashboardGroup {
// 	if (dg.dashboards.length === 1 || !dg.dashboards.find(d => d.id === id)) {
// 		return dg;
// 	}

// 	return {
// 		...dg,
// 		activeDashboardId: selectNewActive(dg.dashboards, id),
// 		dashboards: dg.dashboards
// 			.filter(d => d.id !== id)
// 			.map((d, index) => ({ ...d, order: index })),
// 	};
// }

// function selectNewActive(dashboards: IDashboardPrivate[], id: string) {
// 	const newIndex = dashboards
// 		.reverse()
// 		.findIndex(dashboard => dashboard.id === id) - 1;

// 	if (newIndex === -1) {
// 		return dashboards[dashboards.length - 1].id;
// 	} else {
// 		return dashboards[newIndex].id;
// 	}
// }

export function changeWidgetsState(dg: IDashboardGroup, widgetsState: IWidgetState[]): IDashboardGroup {
	return {
		...dg,
		dashboards: updateById(
			dg.dashboards,
			dg.activeDashboardId,
			(d) => changeWidgetsStateInDashboard(d, widgetsState),
		),
	};
}

export function deleteWidget(dg: IDashboardGroup, widgetId: string, widgetsState: IWidgetState[]): IDashboardGroup {
	return {
		...dg,
		dashboards: updateById(
			dg.dashboards,
			dg.activeDashboardId,
			(d) => deleteWidgetInDashboard(d, widgetId, widgetsState),
		),
	};
}

export function renameDashboard(dg: IDashboardGroup, id: string, name: string): IDashboardGroup {
	return {
		...dg,
		dashboards: updateById(
			dg.dashboards,
			id,
			(d) => ({ ...d, name }),
		),
	};
}

// function getAllWidgetIds(dg: IDashboardGroup, type: WidgetType): string[] {
// 	const dashboard = dg.dashboards.find(d => d.id === dg.activeDashboardId);

// 	return dashboard ? getAllWidgetIdsInDashboard(dashboard, type) : [];
// }

export function changeActiveColumnNum(dg: IDashboardGroup, colNum: number): IDashboardGroup {
	return {
		...dg,
		activeColNum: colNum,
		dashboards: dg.dashboards.map(d => setActiveColumn(d, colNum)),
	};
}

export function createDashboardGroup(colNum: number): IDashboardGroup {
	const mainDashboard = createDashboardFromPreset('Main', 0, colNum);
	const cryptoDashboard = createDashboardFromPreset('Crypto', 1, colNum);
	const stockDashboard = createDashboardFromPreset('Stock', 2, colNum);
	const forexDashboard = createDashboardFromPreset('Forex', 3, colNum);

	return {
		activeColNum: colNum,
		activeDashboardId: mainDashboard.id,
		dashboards: [mainDashboard, cryptoDashboard, stockDashboard, forexDashboard],
	};
}

export interface IDashboardTab {
	id: string;
	name: string;
	isActive: boolean;
}

export function areDashboardGroupsEqual(a: IDashboardGroup, b: IDashboardGroup): boolean {
	if (a === b) {
		return true;
	}
	if (!a || !b) {
		return false;
	}

	if (a.activeDashboardId !== b.activeDashboardId) {
		return false;
	}
	if (a.activeColNum !== b.activeColNum) {
		return false;
	}

	if (a.dashboards.length !== b.dashboards.length) {
		return false;
	}

	const sortDashboards = (d: IDashboardPrivate[]) =>
		[...d].sort((x, y) => x.order - y.order || x.id.localeCompare(y.id));

	const dashboardsA = sortDashboards(a.dashboards);
	const dashboardsB = sortDashboards(b.dashboards);

	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < dashboardsA.length; i++) {
		const da = dashboardsA[i];
		const db = dashboardsB[i];
		if (!areDashboardsEqual(da, db)) {
			return false;
		}
	}

	return true;
}

function areDashboardsEqual(a: IDashboardPrivate, b: IDashboardPrivate): boolean {
	if (a.id !== b.id) {
		return false;
	}
	if (a.name !== b.name) {
		return false;
	}
	if (a.order !== b.order) {
		return false;
	}
	if (a.activeColNum !== b.activeColNum) {
		return false;
	}

	// Compare layouts (Record<number, IWidget[]>)
	const keysA = Object.keys(a.layout) as unknown as number[];
	const keysB = Object.keys(b.layout);

	if (keysA.length !== keysB.length) {
		return false;
	}

	for (const key of keysA) {
		if (!b.layout[key]) {
			return false;
		}

		const widgetsA = a.layout[key];
		const widgetsB = b.layout[key];

		if (widgetsA.length !== widgetsB.length) {
			return false;
		}

		for (let i = 0; i < widgetsA.length; i++) {
			if (!areWidgetsEqual(widgetsA[i], widgetsB[i])) {
				return false;
			}
		}
	}

	return true;
}


function areWidgetsEqual(a: IWidget, b: IWidget): boolean {
	if (a.id !== b.id) {
		return false;
	}
	if (a.name !== b.name) {
		return false;
	}
	if (a.widgetType !== b.widgetType) {
		return false;
	}
	if (a.description !== b.description) {
		return false;
	}
	if (a.defaultStateType !== b.defaultStateType) {
		return false;
	}

	if (!areSizeEqual(a.maxSize, b.maxSize)) {
		return false;
	}
	if (!areSizeEqual(a.minSize, b.minSize)) {
		return false;
	}
	if (!areSizeEqual(a.defaultSize, b.defaultSize)) {
		return false;
	}
	if (!arePositionEqual(a.position, b.position)) {
		return false;
	}

	return true;
}

function areSizeEqual(a: ISize, b: ISize): boolean {
	return a.w === b.w && a.h === b.h;
}

function arePositionEqual(a: IPosition, b: IPosition): boolean {
	return a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
}
