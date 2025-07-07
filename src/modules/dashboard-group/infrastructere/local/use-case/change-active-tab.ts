import type { IRepository } from '../../../domains/adapters';
import type { IChangeActiveTabUc } from '../../../domains/uce-cases';

export function ChangeActiveTa(repo: IRepository): IChangeActiveTabUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			const dashboard = dashboardGroup.changeActiveDashboard(_in.tabId);

			await repo.Set(dashboardGroup);

			return {
				activeTabId: _in.tabId,
				dashboard,
			};
		},
	};
}
