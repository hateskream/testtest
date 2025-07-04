import type { IAddWidgetUc } from './add-widget';
import type { IChangeActiveTabUc } from './change-active-tab';
import type { IChangeDashboardStateUc } from './change-dashboard-state';
import type { IChangeTabOrderUc } from './change-tab-order';
import type { ICreateTabUc } from './create-tab';
import type { IDeleteWidgetUc } from './delete-widget';
import type { IGetDashboardsUc } from './get-dashboards';
import type { IGetWidgetListUc } from './get-widget-list';
import type { IRenameTabUc } from './rename-tab';

export interface IUseCaseFactory {
	GetDashboardsUc: () => IGetDashboardsUc;
	CreateTabUc: () => ICreateTabUc;
	DeleteTabUc: () => IDeleteWidgetUc;
	ChangeActiveTabUc: () => IChangeActiveTabUc;
	RenameTabUc: () => IRenameTabUc;
	ChangeTabOrderUc: () => IChangeTabOrderUc;
	AddWidgetUc: () => IAddWidgetUc;
	DeleteWidgetUc: () => IDeleteWidgetUc;
	GetWidgetListUc: () => IGetWidgetListUc;
	ChangeDashboardStateUc: () => IChangeDashboardStateUc;
}
