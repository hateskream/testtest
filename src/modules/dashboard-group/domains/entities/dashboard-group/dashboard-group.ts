import type { Dashboard } from '../dashboard/dashboard';

export class DashboardGroup {
	private constructor(
		private _activeDashboardId: string,
		private _dashboards: Dashboard[],
	) {}

	get dashboards(): Dashboard[] {
		return this._dashboards;
	}

	get activeDashboardId(): string {
		return this._activeDashboardId;
	}

	changeActiveDashboard(id: string) {
		this._activeDashboardId = id;
	}

	addDashboard(dashboard: Dashboard) {
		this._dashboards.push(dashboard);
	}

	// removeDashboard(id: string) {
	// 	this._dashboards = this._dashboards.filter(dashboard => dashboard.id !== id);
	// }

	// static createNew()
}
