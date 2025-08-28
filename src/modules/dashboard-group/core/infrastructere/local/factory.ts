import type { IRepository, IWidgetProducer } from '../../domains/adapters';
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
import { LSDashboardGroup, type IOptions } from './repository/ls-dashboard-group';
import { DeleteTab } from './use-case/delete-tab';
import { GetAllWidgetIds } from './use-case/get-all-widget-ids';
import { WidgetProducer } from './producer';

// использовать напрямую нельзя, без export ts дает ошибку
//Property 'repo' of exported anonymous class type may not be private or protected.ts(4094)
export class LocalFactoryImpl implements IUseCaseFactory {
	constructor(
		private readonly repo : IRepository,
		private readonly widgetProducer : IWidgetProducer,
	) {}

	GetAllWidgetIds() {
		return GetAllWidgetIds(this.repo);
	}

	GetDashboardsUc() {
		return GetDashboards(this.repo);
	}

	CreateTabUc() {
		return CreateTab(this.repo);
	}

	DeleteTabUc() {
		return DeleteTab(this.repo);
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
		return AddWidget(this.repo, this.widgetProducer);
	}

	DeleteWidgetUc() {
		return DeleteWidget(this.repo, this.widgetProducer);
	}

	GetWidgetListUc() {
		return GetWidgetList();
	}

	ChangeDashboardStateUc() {
		return ChangeDashboardState(this.repo);
	}
}

let LocalFactoryImplInstance : LocalFactoryImpl | null = null;

export function LocalFactory(lsKey : string, options?: IOptions): LocalFactoryImpl {
	if (LocalFactoryImplInstance === null) {
		const repo = new LSDashboardGroup(lsKey, options);

		const widgetProducer = new WidgetProducer();

		repo.init();

		LocalFactoryImplInstance = new LocalFactoryImpl(repo, widgetProducer);
	}

	return LocalFactoryImplInstance;
}
