import type { IGetterDashboardGroup, ISetterDashboardGroup } from '../../domains/adapters/contract';
import type { IDeleteTabUc } from '../../domains/uce-cases';



export function DeleteTab(repo: IRepository): IDeleteTabUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			// TODO: реализовать метод удаления таба в DashboardGroup
			const { activeTabId, dashboards } = dashboardGroup.deleteTab(_in.tabId);

			await repo.Set(dashboardGroup);

			return {
				activeTabId,
				dashboards,
			};
		},
	};
}
