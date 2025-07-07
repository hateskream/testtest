import type { IRepository } from '../../domains/adapters/contract';
import { allWidgets } from '../../domains/entities/widget';
import type { IDeleteTabUc } from '../../domains/uce-cases';


export function DeleteTab(repo: IRepository): IDeleteTabUc {
	return {
		async execute(_in) {
			const dashboardGroup = await repo.Get();

			const dashboard = dashboardGroup.deleteDashboard(_in.tabId);

			await repo.Set(dashboardGroup);

			const widgets = allWidgets();

			return {
				dashboard,
				widgets,
			};
		},
	};
}
