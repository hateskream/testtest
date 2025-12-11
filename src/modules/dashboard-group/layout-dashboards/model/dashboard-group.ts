import { createDashboardFromPreset, type IDashboard } from './dashboard';

export interface IDashboardGroup {
	activeDashboardId: string;
	dashboards: IDashboard[];
}

export function createDashboardGroup(): IDashboardGroup {
	const cryptoDashboard = createDashboardFromPreset('Crypto');
	const stockDashboard = createDashboardFromPreset('Stock');
	const mainDashboard = createDashboardFromPreset('Main');

	return {
		activeDashboardId: mainDashboard.id,
		dashboards: [mainDashboard, cryptoDashboard, stockDashboard],
	};
}

export function changeActiveDashboard(dg: IDashboardGroup, id: string): IDashboardGroup {
	return {
		...dg,
		activeDashboardId: id,
	};
}
