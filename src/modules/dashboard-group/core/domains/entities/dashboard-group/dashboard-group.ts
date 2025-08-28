import { Dashboard } from '../dashboard/dashboard';
import { Widget, WidgetType, type IWidgetState } from '../widget';
import type { IPosition } from '../widget/position';
import { AttemptDeleteLastDashboard, NotFoundDashboard } from './error';

export class DashboardGroup {
	private lastOrder = 0;

	private constructor(
		private _activeDashboardId: string,
		private _dashboards: Dashboard[],
	) {}

	getDashboardsByColNum(colNum: number): Dashboard[] {
		this._dashboards.forEach(dashboard => {
			dashboard.activeColNum = colNum;
		});

		return this._dashboards;
	}

	get dashboards(): Dashboard[] {
		return this._dashboards;
	}

	get activeDashboardId(): string {
		return this._activeDashboardId;
	}

	addWidget(type: string, position: IPosition, widgetsState: IWidgetState[]): Widget {
		return this
			.findActiveDashboard()
			.addWidget(type, position, widgetsState);
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

		const { activeColNum = 0 } = this._dashboards[0] || {};

		const newDashboard = Dashboard.createEmpty(this.lastOrder, activeColNum);

		this._dashboards.push(newDashboard);
		this._activeDashboardId = newDashboard.id;

		return newDashboard;
	}

	deleteDashboard(id: string): Dashboard {
		this.findDashboardById(id);

		if (this._dashboards.length === 1) {
			throw new AttemptDeleteLastDashboard('You cannot delete the last dashboard');
		}

		this.selectNewActive(id);
		this._dashboards = this._dashboards.filter(dashboard => dashboard.id !== id);
		this.calculateOrder();


		return this.findActiveDashboard();
	}

	changeStateWidgets(widgetsState: IWidgetState[]) {
		this.findActiveDashboard().changeWidgetsState(widgetsState);
	}

	deleteWidget(widgetId: string, widgetsState: IWidgetState[]): Widget {
		return this.findActiveDashboard().deleteWidget(widgetId, widgetsState);
	}

	renameDashboard(id: string, name: string) {
		this.findDashboardById(id).name = name;
	}

	getAllWidgetIds(type: WidgetType): string[] {
		return this.findActiveDashboard().getAllWidgetIds(type);
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
		const mainDashboard = Dashboard.createFromPreset('Main', 0);
		const cryptoDashboard = Dashboard.createFromPreset('Crypto', 1);
		const stockDashboard = Dashboard.createFromPreset('Stock', 2);
		const forexDashboard = Dashboard.createFromPreset('Forex', 3);

		const dashboards = [mainDashboard, cryptoDashboard, stockDashboard, forexDashboard];

		const dashboardGroup = new DashboardGroup(mainDashboard.id, dashboards);

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
