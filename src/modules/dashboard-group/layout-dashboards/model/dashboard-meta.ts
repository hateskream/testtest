import { createDashboardFromPreset, type IDashboard, type PresetName, STABLE_DASHBOARD_IDS } from './dashboard';

export interface IDashboardMeta {
	id: string;
	name: string;
	isComingSoon?: boolean;
	comingSoonText?: string;
}

export function createDashboardMetaDefaults(): IDashboardMeta[] {
	const main = createDashboardFromPreset('Main');
	const crypto = createDashboardFromPreset('Crypto');
	const stock = createDashboardFromPreset('Stock');

	return [main, crypto, stock];
}

export function getDefaultDashboardState(dashboardId: string): IDashboard {
	const presetEntry = Object.entries(STABLE_DASHBOARD_IDS)
		.find(([, id]) => id === dashboardId);

	if (!presetEntry) {
		throw new Error(`Unknown dashboard id: ${dashboardId}`);
	}

	return createDashboardFromPreset(presetEntry[0] as PresetName);
}
