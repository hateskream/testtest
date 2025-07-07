import type { IRepository } from '../../domains/adapters';
import { allWidgets } from '../../domains/entities/widget';
import type { ICreateTabUc } from '../../domains/uce-cases';


export function CreateTab(repo: IRepository): ICreateTabUc {
	return {
		async execute() {
			const dashboardGroup = await repo.Get();

			const id = dashboardGroup.createNewDashboard();

			await repo.Set(dashboardGroup);

			const widgets = allWidgets();
			return {
				tabId : id,
				widgets,
			};
		},
	};
}
