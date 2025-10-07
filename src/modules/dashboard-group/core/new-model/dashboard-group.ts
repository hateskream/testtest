import { updateById } from '@/shared/lib';
import {
	type IDashboardPrivate,
	type IDashboard,
	addWidget as addWidgetInDashboard,
	createEmptyDashboard,
	changeWidgetsState as changeWidgetsStateInDashboard,
	deleteWidget as deleteWidgetInDashboard,
	getAllWidgetIds as getAllWidgetIdsInDashboard,
	createDashboardFromPreset,
	fromInnerToPublicDashboard,
	setActiveColumn,
} from './dashboard';
import type { IPosition, IWidgetState, WidgetType } from './widget';

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

function changeTabOrder(dg: IDashboardGroup, newOrder: string[]): IDashboardGroup {
	const isValid =
		dg.dashboards.length === newOrder.length &&
		dg.dashboards.every(d => newOrder.includes(d.id));

	if (!isValid) {
		return dg;
	}

	return {
		...dg,
		dashboards: newOrder
			.map((id, index) => ({
				...dg.dashboards.find(d => d.id === id)!,
				order: index,
			})),
	};
}

export function addNewDashboard(dg: IDashboardGroup): IDashboardGroup {
	const { activeColNum = 0 } = dg.dashboards[0] || {};

	const newDashboard = createEmptyDashboard(dg.dashboards.length + 1, activeColNum);


	return {
		...dg,
		activeDashboardId: newDashboard.id,
		dashboards: [...dg.dashboards, newDashboard],
	};
}

function deleteDashboard(dg: IDashboardGroup, id: string): IDashboardGroup {
	if (dg.dashboards.length === 1 || !dg.dashboards.find(d => d.id === id)) {
		return dg;
	}

	return {
		...dg,
		activeDashboardId: selectNewActive(dg.dashboards, id),
		dashboards: dg.dashboards
			.filter(d => d.id !== id)
			.map((d, index) => ({ ...d, order: index })),
	};
}

function selectNewActive(dashboards: IDashboardPrivate[], id: string) {
	const newIndex = dashboards
		.reverse()
		.findIndex(dashboard => dashboard.id === id) - 1;

	if (newIndex === -1) {
		return dashboards[dashboards.length - 1].id;
	} else {
		return dashboards[newIndex].id;
	}
}

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

function getAllWidgetIds(dg: IDashboardGroup, type: WidgetType): string[] {
	const dashboard = dg.dashboards.find(d => d.id === dg.activeDashboardId);

	return dashboard ? getAllWidgetIdsInDashboard(dashboard, type) : [];
}

function changeActiveColumnNum(dg: IDashboardGroup, colNum: number): IDashboardGroup {
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
