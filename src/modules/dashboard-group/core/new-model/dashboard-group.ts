import { updateById } from '@/shared/lib';
import {
	type IDashboard,
	addWidget as addWidgetInDashboard,
	createEmptyDashboard,
	changeWidgetsState as changeWidgetsStateInDashboard,
	deleteWidget as deleteWidgetInDashboard,
	getAllWidgetIds as getAllWidgetIdsInDashboard,
	createDashboardFromPreset,
} from './dashboard';
import type { IPosition, IWidgetState, WidgetType } from './widget';

interface IDashboardGroup {
	activeDashboardId: string;
	dashboards: IDashboard[];
}

function getDashboardsByColNum(dg: IDashboardGroup, colNum: number): IDashboard[] {
	return dg.dashboards.map(d => ({ ...d, activeColNum: colNum }));
}

function addWidget(
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

function changeActiveDashboard(dg: IDashboardGroup, id: string): IDashboardGroup {
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

function addNewDashboard(dg: IDashboardGroup): IDashboardGroup {
	const { activeColNum = 0 } = dg.dashboards[0] || {};

	const newDashboard = createEmptyDashboard(dg.dashboards.length + 1, activeColNum);


	return {
		activeDashboardId: newDashboard.id,
		dashboards: [...dg.dashboards, newDashboard],
	};
}

function deleteDashboard(dg: IDashboardGroup, id: string): IDashboardGroup {
	if (dg.dashboards.length === 1 || !dg.dashboards.find(d => d.id === id)) {
		return dg;
	}

	return {
		activeDashboardId: selectNewActive(dg.dashboards, id),
		dashboards: dg.dashboards
			.filter(d => d.id !== id)
			.map((d, index) => ({ ...d, order: index })),
	};
}

function selectNewActive(dashboards: IDashboard[], id: string) {
	const newIndex = dashboards
		.reverse()
		.findIndex(dashboard => dashboard.id === id) - 1;

	if (newIndex === -1) {
		return dashboards[dashboards.length - 1].id;
	} else {
		return dashboards[newIndex].id;
	}
}

function changeWidgetsState(dg: IDashboardGroup, widgetsState: IWidgetState[]): IDashboardGroup {
	return {
		...dg,
		dashboards: updateById(
			dg.dashboards,
			dg.activeDashboardId,
			(d) => changeWidgetsStateInDashboard(d, widgetsState),
		),
	};
}

function deleteWidget(dg: IDashboardGroup, widgetId: string, widgetsState: IWidgetState[]): IDashboardGroup {
	return {
		...dg,
		dashboards: updateById(
			dg.dashboards,
			dg.activeDashboardId,
			(d) => deleteWidgetInDashboard(d, widgetId, widgetsState),
		),
	};
}

function renameDashboard(dg: IDashboardGroup, id: string, name: string): IDashboardGroup {
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

function createDashboardGroup(): IDashboardGroup {
	const mainDashboard = createDashboardFromPreset('Main', 0);
	const cryptoDashboard = createDashboardFromPreset('Crypto', 1);
	const stockDashboard = createDashboardFromPreset('Stock', 2);
	const forexDashboard = createDashboardFromPreset('Forex', 3);

	return {
		activeDashboardId: mainDashboard.id,
		dashboards: [mainDashboard, cryptoDashboard, stockDashboard, forexDashboard],
	};
}
