import { Dashboard } from '../dashboard/dashboard';
import { Widget, type IWidgetState } from '../widget';
import type { IPosition } from '../widget/position';
import { NotFoundDashboard } from './error';
export class DashboardGroup {
	private lastOrder = 0;

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

	createNewDashboard(): Dashboard {
		this.lastOrder += 1;
		const newDashboard = Dashboard.createEmpty(this.lastOrder);
		this._dashboards.push(newDashboard);

		return newDashboard;
	}

	deleteDashboard(id: string): Dashboard {
		this.findDashboardById(id);

		if (this._dashboards.length === 1) {
			this.setDefaultState();
		} else {
			this.selectNewActive(id);

			this._dashboards = this._dashboards.filter(dashboard => dashboard.id !== id);

			this.calculateOrder();
		}

		return this.findActiveDashboard();
	}

	private setDefaultState() {
		const emptyDashboard = Dashboard.createEmpty(0);
		const dashboards = [emptyDashboard];

		this._activeDashboardId = emptyDashboard.id;
		this._dashboards = dashboards;
		this.lastOrder = 0;
	}

	changeStateWidgets(widgetsState: IWidgetState[]) {
		this.findActiveDashboard().changeWidgetsState(widgetsState);
	}

	deleteWidget(widgetId: string, widgetsState: IWidgetState[]) {
		this.findActiveDashboard().deleteWidget(widgetId, widgetsState);
	}

	renameDashboard(id: string, name: string) {
		this.findDashboardById(id).name = name;
	}

	private selectNewActive(id: string) {
		const newIndex = this._dashboards
			.reverse()
			.findIndex(dashboard => dashboard.id === id) - 1;

		if (newIndex === -1) {
			this._activeDashboardId = this._dashboards[this._dashboards.length - 1].id;
		} else {
			this._activeDashboardId = this._dashboards[newIndex].id;
		}
	}

	private calculateOrder() {
		this._dashboards.forEach((dashboard, index) => {
			dashboard.order = index;
		});

		this.lastOrder = this._dashboards.length;
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

	static create(): DashboardGroup {
		const emptyDashboard = Dashboard.createMainDashboard(0);
		const dashboards = [emptyDashboard];

		const dashboardGroup = new DashboardGroup(emptyDashboard.id, dashboards);

		dashboardGroup.lastOrder = 0;

		return dashboardGroup;
	}

	static rehydrate(
		_activeDashboardId: string,
		_dashboards: Dashboard[],
	): DashboardGroup {
		const dashboardGroup = new DashboardGroup(_activeDashboardId, _dashboards);

		dashboardGroup.calculateOrder();

		return dashboardGroup;
	}
}
