import type { IRepository } from '../../../domains/adapters';
import type { IRenameTabUc } from '../../../domains/uce-cases';

export function RenameTab(repo: IRepository): IRenameTabUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			dashboardGroup.renameDashboard(_in.tabId, _in.name);

			await repo.Set(dashboardGroup);

			return {
				tabId: _in.tabId,
			};
		},
	};
}
