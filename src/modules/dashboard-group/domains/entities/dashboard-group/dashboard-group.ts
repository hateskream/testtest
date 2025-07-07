import type { Dashboard } from '../dashboard/dashboard';
import { Widget } from '../widget';
import type { IPosition } from '../widget/position';
import { NotFoundActiveDashboard } from './error';

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

	private findActiveDashboard(): Dashboard {
		const foundedDashboard = this._dashboards
			.find(dashboard => dashboard.id === this._activeDashboardId);

		if (foundedDashboard) {
			return foundedDashboard;
		}

		throw new NotFoundActiveDashboard();
	}
}
