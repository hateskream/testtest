import type { Dashboard } from '../dashboard/dashboard';
import { Widget } from '../widget';
import type { IPosition } from '../widget/position';
import { NotFoundDashboard } from './error';
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

	addWidget(type: string, position: IPosition): string {
		const dashboard = this.findActiveDashboard();
		const widget = Widget.create(type, position);
		dashboard.addWidget(widget);

		return widget.id;
	}

	changeActiveDashboard(id: string): Dashboard {
		const dashboards = this.findDashboardById(id);

		this._activeDashboardId = id;

		return dashboards;
	}

	changeTabOrder(newOrder: string[]) {
		this.checkAllDashboardsExist(newOrder);

		newOrder.forEach((dashboardId, index) => {
			this.findDashboardById(dashboardId).order = index;
		});
	}

	private checkAllDashboardsExist(dashboardIds: string[]) {
		dashboardIds.forEach(dashboardId => this.findDashboardById(dashboardId));
	}

	private findActiveDashboard(): Dashboard {
		try {
			return this.findDashboardById(this._activeDashboardId);
		} catch (error) {
			if (error instanceof NotFoundDashboard) {
				throw new NotFoundDashboard('Active dashboard not found');
			}

			throw error;
		}
	}

	private findDashboardById(id: string): Dashboard {
		const foundedDashboard = this._dashboards
			.find(dashboard => dashboard.id === id);

		if (foundedDashboard) {
			return foundedDashboard;
		}

		throw new NotFoundDashboard(`Dashboard with id ${id} not found`);
	}
}
