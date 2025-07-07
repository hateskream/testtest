import type { IGetterDashboardGroup, ISetterDashboardGroup } from '../../domains/adapters/contract';
import type { ICreateTabUc } from '../../domains/uce-cases';



export function CreateTab(repo: IRepository): ICreateTabUc {
	return {
		async execute() {
			const dashboardGroup = await repo.Get();

			// Здесь предполагается, что у DashboardGroup есть метод createTab, возвращающий id и список виджетов
			const { tabId, widgets } = dashboardGroup.createTab();

			await repo.Set(dashboardGroup);

			return {
				tabId,
				widgets,
			};
		},
	};
}
