import type { IGetterDashboardGroup, ISetterDashboardGroup } from '../../domains/adapters';
import type { IRenameTabUc } from '../../domains/uce-cases';



export function RenameTab(repo: IRepository): IRenameTabUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			// TODO: реализовать переименование таба в DashboardGroup
			const tabId = dashboardGroup.renameTab(_in.tabId, _in.name);

			await repo.Set(dashboardGroup);

			return {
				tabId,
			};
		},
	};
}
