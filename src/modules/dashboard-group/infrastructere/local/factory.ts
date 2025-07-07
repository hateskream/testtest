import type { IRepository } from '../../domains/adapters';
import type { IUseCaseFactory } from '../../domains/uce-cases';
import { CreateTab } from './use-case/create-tab';
import { DeleteWidget } from './use-case/delete-widget';
import { GetDashboards } from './use-case/get-dashboards';
import { ChangeActiveTab } from './use-case/change-active-tab';
import { RenameTab } from './use-case/rename-tab';
import { ChangeTabOrder } from './use-case/change-tab-order';
import { AddWidget } from './use-case/add-widget';
import { GetWidgetList } from './use-case/get-widget-list';
import { ChangeDashboardState } from './use-case/change-dashboard-state';
import { LSDashboardGroup } from './repository/ls-dashboard-group';

class LocalFactoryImpl implements IUseCaseFactory {
	constructor(private readonly repo : IRepository) {}

	GetDashboardsUc() {
		return GetDashboards(this.repo);
	}

	CreateTabUc() {
		return CreateTab(this.repo);
	}

	DeleteTabUc() {
		return DeleteWidget(this.repo);
	}

	ChangeActiveTabUc() {
		return ChangeActiveTab(this.repo);
	}

	RenameTabUc() {
		return RenameTab(this.repo);
	}

	ChangeTabOrderUc() {
		return ChangeTabOrder(this.repo);
	}

	AddWidgetUc() {
		return AddWidget(this.repo);
	}

	DeleteWidgetUc() {
		return DeleteWidget(this.repo);
	}

	GetWidgetListUc() {
		return GetWidgetList();
	}

	ChangeDashboardStateUc() {
		return ChangeDashboardState(this.repo);
	}
}

let LocalFactoryImplInstance : LocalFactoryImpl | null = null;

export function LocalFactory(lsKey : string) {
	if (LocalFactoryImplInstance === null) {
		const repo = new LSDashboardGroup(lsKey);

		repo.init();

		LocalFactoryImplInstance = new LocalFactoryImpl(repo);
	}

	return LocalFactoryImplInstance;
}
