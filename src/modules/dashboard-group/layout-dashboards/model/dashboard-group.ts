import { createDashboardFromPreset, type IDashboard } from './dashboard';

export interface IDashboardGroup {
	activeDashboardId: string;
	dashboards: IDashboard[];
}

export function createDashboardGroup(): IDashboardGroup {
	const cryptoDashboard = createDashboardFromPreset('Crypto');
	const stockDashboard = createDashboardFromPreset('Stock');
	const forexDashboard = createDashboardFromPreset('Forex');

	return {
		activeDashboardId: cryptoDashboard.id,
		dashboards: [cryptoDashboard, stockDashboard, forexDashboard],
	};
}
